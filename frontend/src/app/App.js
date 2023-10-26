import mapboxgl from "mapbox-gl";
import { HiXMark } from "react-icons/hi2";
import toast, { Toaster } from "react-hot-toast";
import { Fragment, useRef, useState } from "react";
import { SearchBox } from "@mapbox/search-js-react";
import { Map, Layer, Marker, Source, MapProvider } from "react-map-gl";

import "./App.css";
import "mapbox-gl/dist/mapbox-gl.css";

import { calculateGeometricMedian } from "../utils/center";

const isoLayer = {
  id: "isoLayer",
  type: "fill",
  source: "iso",
  layout: {},
  paint: {
    "fill-color": "#5a3fc0",
    "fill-opacity": 0.3,
  },
};

function App() {
  // For map searching
  const mapRef = useRef();
  const [searchValue, setSearchValue] = useState("");

  const [geojson, setGeojson] = useState({
    type: "FeatureCollection",
    features: [],
  });
  const [addresses, setAddresses] = useState([]);
  const [center, setCenter] = useState(undefined);

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
  };

  const handleFindCenter = () => {
    if (addresses.length < 2) {
      toast.error("At least two address must be provided!");
      return;
    }

    // Find and set center
    const coordinates = addresses.map((address) => ({
      latitude: address.geometry.coordinates[1],
      longitude: address.geometry.coordinates[0],
    }));
    const center = calculateGeometricMedian(coordinates);
    console.log(center);

    setCenter(center);
    mapRef.current.flyTo({
      center: [center.longitude, center.latitude],
      zoom: 14,
    });

    // Find iso
    getIso(center);
  };

  // Create a function that sets up the Isochrone API query then makes an fetch call
  const getIso = async (center) => {
    // Create constants to use in getIso()
    const urlBase = "https://api.mapbox.com/isochrone/v1/mapbox/";
    const { latitude, longitude } = center;
    const profile = "driving"; // Set the default routing profile
    const minutes = 30; // Set the default duration

    const query = await fetch(
      `${urlBase}${profile}/${longitude},${latitude}?contours_minutes=${minutes}&polygons=true&access_token=${process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}`,
      { method: "GET" }
    );

    const data = await query.json();
    setGeojson((prevValue) => ({
      ...prevValue,
      features: data.features,
    }));
  };

  const handleRemoveAddress = (mapbox_id) => {
    setAddresses((prevValue) =>
      prevValue.filter((address) => address.properties.mapbox_id !== mapbox_id)
    );
  };

  return (
    <Fragment>
      <Toaster />
      <main className="container max-w-xl mx-auto py-8">
        <section className="mb-4">
          <h1 className="font-medium text-lg">Meet in the middle</h1>
          <p className="text-sm text-gray-400">
            Find the midpoint of a set of addresses and receive recommendations
            on restaurants in that area.
          </p>
        </section>
        <section className="h-96 rounded-lg overflow-hidden border border-slate-200">
          <MapProvider>
            <Map
              ref={mapRef}
              mapLib={mapboxgl}
              attributionControl={false}
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
                  <Source id="iso" type="geojson" data={geojson}>
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

        {Boolean(addresses.length) && (
          <Fragment>
            <hr className="my-6" />

            <section className="mt-4">
              <h2 className="text-sm font-medium">Selected addresses</h2>
              <ul className="mt-3 space-y-2">
                {addresses.map((address, index) => (
                  <li
                    key={index}
                    className="group flex items-center justify-between bg-gray-100 py-2 px-3 rounded-md border border-gray-300 shadow-sm"
                  >
                    <div>
                      <p className="text-sm">{address.properties.address}</p>
                      <p className="text-sm">
                        {address.properties.place_formatted}
                      </p>
                    </div>
                    <button
                      className="p-2 rounded-full group-hover:bg-gray-200 cursor-pointer"
                      onClick={() =>
                        handleRemoveAddress(address.properties.mapbox_id)
                      }
                    >
                      <HiXMark className="w-5 h-5  text-gray-400 group-hover:text-gray-500" />
                    </button>
                  </li>
                ))}
              </ul>
              {addresses.length > 1 && (
                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={handleFindCenter}
                    className="text-sm text-gray-50 bg-blue-600 px-3 py-2 rounded-md shadow-sm"
                  >
                    Find midpoint
                  </button>
                </div>
              )}
            </section>
          </Fragment>
        )}
      </main>
    </Fragment>
  );
}

export default App;
