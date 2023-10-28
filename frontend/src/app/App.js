import axios from "axios";
import mapboxgl from "mapbox-gl";
import { HiXMark } from "react-icons/hi2";
import { MdFoodBank } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { SearchBox } from "@mapbox/search-js-react";
import { Fragment, useRef, useState, useEffect } from "react";
import { Map, Layer, Marker, Source, MapProvider, Popup } from "react-map-gl";

import "./App.css";
import "mapbox-gl/dist/mapbox-gl.css";

import { calculateGeometricMedian } from "../utils/center";

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

  // Businesses
  const [businesses, setBusinesses] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(undefined);

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
    setBusinesses([]);
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
          data: { businesses },
        },
      }) {
        console.log(businesses);
        setBusinesses(businesses);
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
      setBusinesses([]);
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

  useEffect(() => {
    console.log(selectedBusiness);
  }, [selectedBusiness]);

  return (
    <Fragment>
      <Toaster />
      <main className="container max-w-xl mx-auto py-8">
        <section className="mb-4">
          <h1 className="font-medium text-lg">Meet in the middle</h1>
          <p className="text-sm text-gray-500">
            Find the midpoint of a set of addresses and receive recommendations
            on restaurants in that area.
          </p>
        </section>
        <section className="h-96 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
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
              {Boolean(businesses.length) &&
                businesses.map((business, index) => (
                  <Marker
                    key={index}
                    onClick={(event) => {
                      console.log(event);

                      setShowPopup(true);
                      setSelectedBusiness(business);
                    }}
                    latitude={business.coordinates.latitude}
                    longitude={business.coordinates.longitude}
                  >
                    <MdFoodBank size={24} color="FF6A00" />
                  </Marker>
                ))}
              {showPopup && selectedBusiness && (
                <Popup
                  anchor="bottom"
                  className="p-3"
                  closeOnClick={false}
                  onClose={() => setShowPopup(false)}
                  latitude={selectedBusiness.coordinates.latitude}
                  longitude={selectedBusiness.coordinates.longitude}
                >
                  <div>
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={selectedBusiness.url}
                    >
                      <h3>{selectedBusiness.name}</h3>
                    </a>
                    {selectedBusiness.location.display_address.map(
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

        <section className="mt-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium">Addresses</h2>
              <p className="text-xs text-gray-500">
                At least two addresses must be provided for a center to be
                calculated.
              </p>
            </div>
            {(() => {
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
          </div>
          {addresses.length ? (
            <Fragment>
              <ul className="space-y-2">
                {addresses.map((address, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between bg-gray-100 py-2 px-3 rounded-md border border-gray-300 shadow-sm"
                  >
                    <div>
                      <p className="text-sm">{address.properties.address}</p>
                      <p className="text-sm">
                        {address.properties.place_formatted}
                      </p>
                    </div>
                    <div className="group">
                      <button
                        className="p-2 rounded-full group-hover:bg-gray-200 cursor-pointer"
                        onClick={() =>
                          handleRemoveAddress(address.properties.mapbox_id)
                        }
                      >
                        <HiXMark className="w-5 h-5  text-gray-400 group-hover:text-gray-500" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </Fragment>
          ) : (
            <div className="bg-gray-100 border border-gray-200 rounded-lg p-8 flex flex-col items-center justify-center text-sm shadow-sm">
              <FaMapMarkerAlt className="text-gray-400" size={20} />
              <p className="text-gray-400 mt-2">Search for an address</p>
            </div>
          )}
        </section>

        {Boolean(businesses.length) && (
          <Fragment>
            <hr className="my-6" />

            <section>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-medium">Businesses</h2>
                  <p className="text-xs text-gray-500">
                    Select a business to find it on the map.
                  </p>
                </div>
              </div>
              {businesses.length ? (
                <Fragment>
                  <ul className="space-y-2">
                    {businesses.map((business, index) => (
                      <li
                        key={index}
                        className="h-44 flex items-center rounded-md border border-gray-300 shadow-sm overflow-hidden"
                      >
                        <div className="border-r border-gray-100 w-64">
                          <img
                            alt={business.alias}
                            src={business.image_url}
                            className="object-cover h-44 w-64"
                          />
                        </div>
                        <div className="p-4 text-sm">
                          <h3 className="font-medium">
                            {business.name}{" "}
                            <span className="font-semibold">
                              {business.price}
                            </span>
                          </h3>
                          {/* Use rating stars and yelp logo for external redirect */}
                          <p>
                            {business.rating} stars, {business.review_count}{" "}
                            reviews
                          </p>
                          <p>{business.location.address1}</p>
                          <p>
                            {business.location.city}, {business.location.state}{" "}
                            {business.location.zip_code}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Fragment>
              ) : (
                <div className="bg-gray-100 border border-gray-200 rounded-lg p-8 flex flex-col items-center justify-center text-sm shadow-sm">
                  <MdFoodBank className="text-gray-400" size={20} />
                  <p className="text-gray-400 mt-2">
                    No businesses found in the area
                  </p>
                </div>
              )}
            </section>
          </Fragment>
        )}
      </main>
      <footer className="bottom-0 w-full h-48">
        <div className="container max-w-xl mx-auto border-t border-gray-200 pt-4 px-1 text-sm text-gray-400">
          <p>Powered by Mapbox and Yelp API. Built with React and Express.</p>
        </div>
      </footer>
    </Fragment>
  );
}

export default App;
