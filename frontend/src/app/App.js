import "./App.css";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Input from "../components/input";
import { HiXMark } from "react-icons/hi2";
import { Fragment, useState } from "react";
import Map, { Marker, Source, Layer } from "react-map-gl";
import toast, { Toaster } from "react-hot-toast";
import { AddressAutofill } from "@mapbox/search-js-react";
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
  const [geojson, setGeojson] = useState({
    type: "FeatureCollection",
    features: [],
  });
  const [addresses, setAddresses] = useState([]);
  const [center, setCenter] = useState(undefined);
  const [mapViewState, setMapViewState] = useState({
    longitude: -122.40899552306048,
    latitude: 37.78731236940814,
    zoom: 14,
  });

  const handleRetrieve = (res) => {
    const features = res.features[0];
    // console.log(features);

    const idExists = addresses.some(
      (obj) => obj.properties.id === features.properties.id
    );

    if (idExists) {
      toast.error("This address exists in the list!");
      return;
    }

    setMapViewState({
      longitude: features.geometry.coordinates[0],
      latitude: features.geometry.coordinates[1],
      zoom: 14,
    });
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
    setMapViewState({
      ...center,
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
          <Map
            {...mapViewState}
            mapLib={mapboxgl}
            attributionControl={false}
            initialViewState={mapViewState}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            onMove={(event) => setMapViewState(event.viewState)}
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
          </Map>
        </section>

        <hr className="my-6" />

        <form>
          <AddressAutofill
            onRetrieve={handleRetrieve}
            accessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
          >
            <Input
              type="text"
              name="address"
              label="Add an address"
              autoComplete="address-line1"
              placeholder="12375 East 86th Street North"
            />
          </AddressAutofill>
        </form>

        {Boolean(addresses.length) && (
          <section className="mt-4">
            <h2 className="text-sm font-medium">Selected addresses</h2>
            <ul className="mt-2 space-y-2">
              {addresses.map((address, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-gray-100 py-2 px-3 rounded-md border border-gray-200"
                >
                  <div>
                    <p className="text-sm">{address.properties.feature_name}</p>
                    <p className="text-sm">{address.properties.description}</p>
                  </div>
                  <HiXMark className="w-5 h-5 cursor-pointer" />
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
        )}
      </main>
    </Fragment>
  );
}

export default App;
