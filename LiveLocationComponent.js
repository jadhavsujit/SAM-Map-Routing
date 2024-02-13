import React, { useState, useEffect } from 'react';

const LiveLocationComponent = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to get the user's current location
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
          (position) => {
            // Update the component state with the current location
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (err) => {
            // Handle errors if any
            setError(err.message);
          }
        );
      } else {
        setError('Geolocation is not supported by this browser.');
      }
    };

    // Call the function to get the initial location
    getLocation();

    // You can set an interval to update the location at regular intervals if needed
    // const intervalId = setInterval(getLocation, 5000);

    // Cleanup the interval on component unmount
    // return () => clearInterval(intervalId);

    // Note: Uncomment the lines above if you want to update the location at regular intervals
  }, []); // Empty dependency array ensures useEffect runs only once on component mount

  return (
    <div>
      {error && <p>Error: {error}</p>}
      {location && (
        <p>
          Latitude: {location.latitude}, Longitude: {location.longitude}
        </p>
      )}
    </div>
  );
};

export default LiveLocationComponent;
