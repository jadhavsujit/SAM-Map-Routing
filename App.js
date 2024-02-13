import React from 'react';
import LiveLocationComponent from './components/LiveLocationComponent'; // Update the path based on your project structure
import Map from './components/Map';
const App = () => {
const [currentLocation , setCurrentLocation] = React.useState(null);

const handlelocationUpdate = (newLocation) => {
setCurrentLocation(newLocation);
};

return (
  <div>
    <h1>SAM Carpool</h1>
  <LiveLocationComponent onLocationUpdate = {handlelocationUpdate}/>
  <Map currentLocation={currentLocation} />
    {/* Add other components or content here */}
  </div>
);
};

export default App;
