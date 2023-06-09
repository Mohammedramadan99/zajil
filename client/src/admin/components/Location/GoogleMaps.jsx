import React, { useEffect, useState } from "react";
import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api";

function GoogleMaps({ w, selectedAddress, setSelectedAddress }) {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const center = currentLocation || null;
  console.log({ center });
  console.log({ currentLocation });

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

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          console.log("Error: The Geolocation service failed.");
        }
      );
    } else {
      console.log("Error: Your browser doesn't support geolocation.");
    }
  };
  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <div>
      <GoogleMap
        center={center}
        zoom={15}
        onClick={handleMapClick}
        mapContainerStyle={{ width: w ? w : "100%", height: "400px" }}>
        {selectedLocation && <Marker position={selectedLocation} />}
      </GoogleMap>
    </div>
  );
}

export default GoogleMaps;
