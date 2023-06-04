import React from "react";
import { useJsApiLoader, GoogleMap } from "@react-google-maps/api";
const center = { lat: 48.8584, lng: 2.2945 };
function GoogleMaps() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyA_q_hh_dIv3rTWvWWXYcNn0aY_W0OD4VQ",
  });
  if (!isLoaded) {
    return <div>loading...</div>;
  }
  return (
    <GoogleMap
      center={center}
      zoom={15}
      mapContainerStyle={{ width: "500px", height: "400px" }}></GoogleMap>
  );
}

export default GoogleMaps;
