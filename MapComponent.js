import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { getDistanceLatLog } from 'google-map-api-helper';

function MyComponent() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyBNc6ppe_8pZaHeSUQXziLSCW3rrCTG5xA"
  });

  const [map, setMap] = useState(null);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropLocation, setDropLocation] = useState(null);
  const [containerWidth, setContainerWidth] = useState(window.innerWidth * 1); // 100% of window width
  const [containerHeight, setContainerHeight] = useState(window.innerHeight * 0.8); // 80% of window height
  const [selectedStops, setSelectedStops] = useState([]);
  const [selectedStop, setSelectedStop] = useState('');

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

    // If pickupLocation is not set, set the clicked location as pickup
    if (!pickupLocation) {
      setPickupLocation(clickedLocation);
    } else {
      // If pickupLocation is set, set the clicked location as drop
      setDropLocation(clickedLocation);
    }
  };

getDistanceLatLog({lat:26.549394, log:80.5370636}, {lat:26.6418662,log:80.7651918})
.then(res => console.log(res))
.catch(error => console.log(error))

const handleSelectChange = (event) => {
  setSelectedStop(event.target.value);
};

const handleRemoveStop = (stop) => {
  setSelectedStops(selectedStops.filter(s => s !== stop));
};

const handleCalculateRoute = () => {
  // implement the route calculation logic
};


return isLoaded ? (
  <div>
    <div>
      <label>Pickup Location:</label>
      <input type="text" value={pickupLocation ? `${pickupLocation.lat}, ${pickupLocation.lng}` : ''} readOnly />
    </div>
    <div>
      <label>Drop Location:</label>
      <input type="text" value={dropLocation ? `${dropLocation.lat}, ${dropLocation.lng}` : ''} readOnly />
    </div>
    <div>
      <select value={selectedStop} onChange={handleSelectChange}>
        <option value="">Choose Stops</option>
        {selectedStops.map((stop, index) => (
          <option key={index} value={stop}>{stop}</option>
        ))}
      </select>
    </div>
    <div>
      {selectedStops.map((stop, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
          <span>{stop}</span>
          <button onClick={() => handleRemoveStop(stop)}>X</button>
        </div>
      ))}
    </div>
    <button onClick={handleCalculateRoute}>Calculate Route</button>

    <GoogleMap
      mapContainerStyle={{
        width: containerWidth,
        height: containerHeight
      }}
      center={{ lat: 18.591863058613566, lng: 73.70095995826493 }} // Renishaw Metrology India, Pune branch (18.591863058613566, 73.70095995826493)
      zoom={17}
      onLoad={onLoad}
      onUnmount={onUnmount}
      onClick={handleMapClick}
    >
      {pickupLocation && (
        <Marker position={pickupLocation} label="Pickup" />
      )}
      {dropLocation && (
        <Marker position={dropLocation} label="Drop" />
      )}
    </GoogleMap>
  </div>
) : <></>;
}

export default React.memo(MyComponent);
