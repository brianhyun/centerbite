import axios from "axios";
import mapboxgl from "mapbox-gl";
import { FaMapMarkerAlt } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { Fragment, useRef, useState } from "react";
import { SearchBox } from "@mapbox/search-js-react";
import AddressCard from "./components/address-card";
import { Map, Layer, Marker, Source, MapProvider, Popup } from "react-map-gl";

import "mapbox-gl/dist/mapbox-gl.css";

import FoodIcon from "./components/food-icon";
import RestaurantCard from "./components/restaurant-card";
import SectionHeading from "./components/section-heading";
import NoDataContainer from "./components/no-data-container";

import { calculateGeometricMedian } from "./utils/center";

const initialGeoJsonValue = {
  type: "FeatureCollection",
  features: [],
};

const isoLayer = {
  id: "isoLayer",
  type: "fill",
  source: "iso",
  layout: {},
  paint: {
    "fill-color": "#0080FF",
    "fill-opacity": 0.3,
  },
};

function App() {
  // For map searching
  const mapRef = useRef();
  const [searchValue, setSearchValue] = useState("");

  // Addresses
  const [addresses, setAddresses] = useState([]);
  const [center, setCenter] = useState(undefined);
  const [geoJson, setGeoJson] = useState(initialGeoJsonValue);

  // Restaurants
  const [restaurants, setRestaurants] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(undefined);

  const handleRetrieve = (res) => {
    const features = res.features[0];
    console.log(features);

    // Check if address was already picked
    const idExists = addresses.some(
      (obj) => obj.properties.mapbox_id === features.properties.mapbox_id
    );

    if (idExists) {
      toast.error("This address exists in the list!");
      return;
    }

    // Move to selected address
    const longitude = features.geometry.coordinates[0];
    const latitude = features.geometry.coordinates[1];
    mapRef.current.flyTo({ center: [longitude, latitude] });

    // Update list
    setAddresses((prevValue) => [features, ...prevValue]);

    // Remove center and isochrone
    setRestaurants([]);
    setCenter(undefined);
    setGeoJson(initialGeoJsonValue);
  };

  const handleFindCenter = () => {
    if (center) {
      toast.error("The middle was already found!");
      return;
    } else if (addresses.length < 2) {
      toast.error("At least two address must be provided!");
      return;
    }

    // Find median and set center
    const coordinates = addresses.map((address) => ({
      latitude: address.geometry.coordinates[1],
      longitude: address.geometry.coordinates[0],
    }));
    const median = calculateGeometricMedian(coordinates);
    const { latitude, longitude } = median;
    console.log(median);

    setCenter(median);
    mapRef.current.flyTo({
      center: [longitude, latitude],
      zoom: 14,
    });

    // Find iso
    getIso(median);

    // Find a set of restaurants
    axios
      .post("/api/yelp/businesses", {
        latitude: latitude,
        longitude: longitude,
      })
      .then(function ({
        data: {
          data: { businesses: restaurants },
        },
      }) {
        console.log(restaurants);
        setRestaurants(restaurants);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  // Create a function that sets up the Isochrone API query then makes an fetch call
  const getIso = async (center) => {
    // Create constants to use in getIso()
    const urlBase = "https://api.mapbox.com/isochrone/v1/mapbox/";
    const { latitude, longitude } = center;
    const profile = "driving"; // Set the default routing profile
    const minutes = 15; // Set the default duration

    const query = await fetch(
      `${urlBase}${profile}/${longitude},${latitude}?contours_minutes=${minutes}&polygons=true&access_token=${process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}`,
      { method: "GET" }
    );

    const data = await query.json();
    setGeoJson((prevValue) => ({
      ...prevValue,
      features: data.features,
    }));
  };

  const handleRemoveAddress = (mapbox_id) => {
    setAddresses((prevValue) => {
      const newSet = prevValue.filter(
        (address) => address.properties.mapbox_id !== mapbox_id
      );

      // Remove center and isochrone
      setRestaurants([]);
      setCenter(undefined);
      setGeoJson(initialGeoJsonValue);

      // Fly to the last element of the address list
      if (newSet.length) {
        const lastAddress = newSet[newSet.length - 1];
        console.log(lastAddress);

        const {
          geometry: { coordinates },
        } = lastAddress;
        mapRef.current.flyTo({
          center: [coordinates[0], coordinates[1]],
          zoom: 14,
        });
      }

      return newSet;
    });
  };

  const handleSelectCard = (restaurant) => {
    console.log(restaurant);

    // Set selected restaurant
    setShowPopup(true);
    setSelectedRestaurant(restaurant);

    // Fly to selected restaurant
    const { coordinates } = restaurant;
    mapRef.current.flyTo({
      center: [coordinates.longitude, coordinates.latitude],
      zoom: 14,
    });

    const element = document.getElementById("heading");

    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Fragment>
      <Toaster />

      <main className="container max-w-xl mx-auto py-8 px-4">
        <section id="heading" className="mb-4 flex items-center space-x-3">
          <div className="bg-gray-50 p-2 border border-gray-200 rounded-xl shadow-sm">
            <FoodIcon size={60} />
          </div>
          <div>
            <h1 className="font-medium text-lg">Meet in the middle</h1>
            <p className="text-xs text-gray-600">
              Find the midpoint of a set of addresses and receive
              recommendations on restaurants in that area.
            </p>
          </div>
        </section>

        <section
          id="map-section"
          className="h-96 rounded-lg overflow-hidden border border-slate-200 shadow-sm"
        >
          <MapProvider>
            <Map
              ref={mapRef}
              mapLib={mapboxgl}
              initialViewState={{
                longitude: -122.40899552306048,
                latitude: 37.78731236940814,
                zoom: 14,
              }}
              mapStyle="mapbox://styles/mapbox/streets-v11"
              mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
            >
              {center && (
                <Fragment>
                  <Marker
                    color="red"
                    latitude={center.latitude}
                    longitude={center.longitude}
                  />
                  <Source id="iso" type="geojson" data={geoJson}>
                    <Layer {...isoLayer} />
                  </Source>
                </Fragment>
              )}
              {Boolean(addresses.length) &&
                addresses.map((address, index) => (
                  <Marker
                    key={index}
                    latitude={address.geometry.coordinates[1]}
                    longitude={address.geometry.coordinates[0]}
                  />
                ))}
              {Boolean(restaurants.length) &&
                restaurants.map((restaurant, index) => (
                  <Marker
                    key={index}
                    onClick={(event) => {
                      console.log(event);

                      setShowPopup(true);
                      setSelectedRestaurant(restaurant);
                    }}
                    latitude={restaurant.coordinates.latitude}
                    longitude={restaurant.coordinates.longitude}
                  >
                    <FoodIcon size={30} />
                  </Marker>
                ))}
              {showPopup && selectedRestaurant && (
                <Popup
                  anchor="bottom"
                  className="p-3"
                  closeOnClick={false}
                  onClose={() => setShowPopup(false)}
                  latitude={selectedRestaurant.coordinates.latitude}
                  longitude={selectedRestaurant.coordinates.longitude}
                >
                  <div>
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={selectedRestaurant.url}
                    >
                      <h3>{selectedRestaurant.name}</h3>
                    </a>
                    {selectedRestaurant.location.display_address.map(
                      (address, index) => (
                        <p key={index}>{address}</p>
                      )
                    )}
                  </div>
                </Popup>
              )}

              <form className="m-2 absolute top-0 right-0 focus:outline-none active:outline-none">
                <SearchBox
                  value={searchValue}
                  options={{
                    language: "en",
                    country: "US",
                  }}
                  onRetrieve={handleRetrieve}
                  placeholder="12375 East 86th Street North"
                  accessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
                />
              </form>
            </Map>
          </MapProvider>
        </section>

        <hr className="my-6" />

        <section id="addresses" className="mt-4">
          <SectionHeading
            heading="Addresses"
            description="At least two addresses must be provided for a center to be
                calculated."
            action={(() => {
              const disabled = !(addresses.length > 1 && !center);

              return (
                <button
                  type="button"
                  disabled={disabled}
                  onClick={handleFindCenter}
                  className="text-sm text-gray-50 bg-blue-600 px-3 py-2 rounded-md shadow-sm flex items-center disabled:bg-gray-100 disabled:border disabled:border-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  <FaMapMarkerAlt
                    size={16}
                    className={`mr-2 ${
                      disabled ? "text-gray-400" : "text-gray-50"
                    }`}
                  />
                  Find middle
                </button>
              );
            })()}
          />
          {addresses.length ? (
            <Fragment>
              <ul className="space-y-2">
                {addresses.map((address, index) => (
                  <li key={index}>
                    <AddressCard
                      address={address}
                      handleRemoveAddress={handleRemoveAddress}
                    />
                  </li>
                ))}
              </ul>
            </Fragment>
          ) : (
            <NoDataContainer
              Icon={<FaMapMarkerAlt className="text-gray-400" size={20} />}
              description="Search for an address"
            />
          )}
        </section>

        {Boolean(restaurants.length) && (
          <Fragment>
            <hr className="my-6" />

            <section id="restaurants">
              <SectionHeading
                heading="Restaurants"
                description="Select a restaurant to find it on the map."
              />
              {restaurants.length ? (
                <Fragment>
                  <ul className="divide-y divide-gray-200">
                    {restaurants.map((restaurant, index) => (
                      <li key={index} className="my-4 first:my-0 last:mb-0">
                        <RestaurantCard
                          restaurant={restaurant}
                          handleSelectCard={handleSelectCard}
                        />
                      </li>
                    ))}
                  </ul>
                </Fragment>
              ) : (
                <NoDataContainer
                  Icon={<FoodIcon size={24} color={false} />}
                  description="No restaurants found in the area"
                />
              )}
            </section>
          </Fragment>
        )}
      </main>

      <footer className="bottom-0 w-full h-48 px-4">
        <div className="container max-w-xl mx-auto border-t border-gray-200 pt-4 px-1 text-sm text-gray-400">
          <p>Powered by Mapbox and Yelp API. Built with React and Express.</p>
        </div>
      </footer>
    </Fragment>
  );
}

export default App;
