import React, { useState } from "react";
import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api";

const center = { lat: 48.8584, lng: 2.2945 };

function GoogleMaps({ w }) {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState("");

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyA_q_hh_dIv3rTWvWWXYcNn0aY_W0OD4VQ",
  });

  // Define a callback function to handle the click event on the map
  const handleMapClick = (event) => {
    setSelectedLocation({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
    console.log({ selectedAddress });
    // Call the Geocoding API to get the address of the selected location
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode(
      { location: { lat: event.latLng.lat(), lng: event.latLng.lng() } },
      (results, status) => {
        if (status === "OK") {
          setSelectedAddress(results[0].formatted_address);
          console.log({ selectedAddress });
        } else {
          console.log(
            "Geocode was not successful for the following reason: " + status
          );
        }
      }
    );
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <GoogleMap
        center={center}
        zoom={15}
        onClick={handleMapClick}
        mapContainerStyle={{ width: w ? w : "500px", height: "400px" }}>
        {selectedLocation && <Marker position={selectedLocation} />}
      </GoogleMap>
      <div>{selectedAddress && <p>Selected Address: {selectedAddress}</p>}</div>
    </div>
  );
}

export default GoogleMaps;
