import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

function MyComponent() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyANncXHdLJ7QdZcjY2T6sIgAvJ3ZOapBF0"
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

  const fetchIntermediateStops = () => {
    if (pickupLocation && dropLocation) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: pickupLocation,
          destination: dropLocation,
          travelMode: window.google.maps.TravelMode.DRIVING
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            const intermediateStops = result.routes[0].legs[0].steps
              .filter(step => step.travel_mode === 'DRIVING' && step.transit)
              .map(step => step.transit.arrival_stop.name);
            setSelectedStops(intermediateStops);
          } else {
            console.error('Failed to fetch intermediate stops:', status);
          }
        }
      );
    }
  };

  useEffect(() => {
    fetchIntermediateStops();
  }, [pickupLocation, dropLocation]);

  const handleSelectChange = (event) => {
    setSelectedStop(event.target.value);
  };

  const handleRemoveStop = (stop) => {
    setSelectedStops(selectedStops.filter(s => s !== stop));
  };

  const handleCalculateRoute = () => {
    // Perform any additional logic needed before calculating the route
    // For simplicity, assume the pickupLocation and dropLocation are valid coordinates
    // This is where you can implement the route calculation logic
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
        center={{ lat: 18.591863058613566, lng: 73.70095995826493 }} // Renishaw Metrology India, Pune branch 18.591863058613566, 73.70095995826493
        zoom={16}
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
