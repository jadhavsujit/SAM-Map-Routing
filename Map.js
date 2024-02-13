import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

function MapWithMarker() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyBNc6ppe_8pZaHeSUQXziLSCW3rrCTG5xA"
  });

  const [map, setMap] = useState(null);
  const [markerPosition, setMarkerPosition] = useState({ lat: 19.1209, lng: 72.8921 });
  const [containerWidth, setContainerWidth] = useState(window.innerWidth * 1); // 100% of window width
  const [containerHeight, setContainerHeight] = useState(window.innerHeight * 0.8); // 80% of window height

  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setContainerWidth(window.innerWidth * 0.8);
      setContainerHeight(window.innerHeight * 0.6);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleMapClick = (event) => {
    const clickedLocation = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    };

    setMarkerPosition(clickedLocation);
  };

  return isLoaded ? (
    <div>
      <GoogleMap
        mapContainerStyle={{
          width: containerWidth,
          height: containerHeight
        }}
        center={markerPosition} // Set the center to the marker position
        zoom={17}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={handleMapClick}
      >
        <Marker position={markerPosition} /> {/* we can add here different icon instead of default */}
      </GoogleMap>
    </div>
  ) : <></>;
}

export default React.memo(MapWithMarker);
