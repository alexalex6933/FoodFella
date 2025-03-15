import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Clock } from 'lucide-react';
import { mockRestaurants } from '../data/mockData';
import Map from 'react-map-gl';

const Home = () => {
  const [locationGranted, setLocationGranted] = useState<boolean | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<typeof mockRestaurants[0] | null>(null);
  const [spinningIndex, setSpinningIndex] = useState(0);

  useEffect(() => {
    if (locationGranted === null) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationGranted(true);
        },
        () => setLocationGranted(false)
      );
    }
  }, [locationGranted]);

  const handleSpin = () => {
    setIsSpinning(true);
    let duration = 3000;
    let interval = 100;
    let startTime = Date.now();

    const spin = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      
      if (elapsed < duration) {
        setSpinningIndex(prev => (prev + 1) % mockRestaurants.length);
        setTimeout(spin, interval);
      } else {
        setIsSpinning(false);
        const randomIndex = Math.floor(Math.random() * mockRestaurants.length);
        setSelectedRestaurant(mockRestaurants[randomIndex]);
      }
    };

    spin();
  };

  if (locationGranted === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f9f7]">
        <div className="text-center p-8">
          <MapPin className="h-16 w-16 text-[#1db954] mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Enable Location Services</h2>
          <p className="text-gray-600 mb-4">
            To show you the best deals near you, we need access to your location
          </p>
          <div className="animate-pulse">
            <div className="h-2 w-24 bg-[#1db954] rounded mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (locationGranted === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f9f7]">
        <div className="text-center p-8">
          <MapPin className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Location Access Denied</h2>
          <p className="text-gray-600 mb-4">
            Please enable location services in your browser to see restaurants near you
          </p>
          <button
            onClick={() => setLocationGranted(null)}
            className="bg-[#1db954] text-white px-6 py-2 rounded-full hover:bg-[#169c46] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (showMap) {
    return (
      <div className="h-[calc(100vh-64px)]">
        <div className="absolute top-20 left-4 z-10">
          <button
            onClick={() => setShowMap(false)}
            className="bg-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-shadow"
          >
            Back to List
          </button>
        </div>
        {/* <Map
          mapboxAccessToken="YOUR_MAPBOX_TOKEN"
          initialViewState={{
            longitude: userLocation?.lng || 151.2093,
            latitude: userLocation?.lat || -33.8688,
            zoom: 13
          }}
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/mapbox/streets-v11"
        /> */}
        <img src="../../mapimg.png"/>
      </div>
    );
  }

  return (
    <div>
      <div className="w-full h-[300px] relative mb-8">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836"
          alt="Food Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white text-center px-4">
            Creating A World Where No Meal Goes To Waste.
          </h1>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Restaurants Near You</h1>
          <button
            onClick={() => setShowMap(true)}
            className="flex items-center space-x-2 bg-[#1db954] text-white px-4 py-2 rounded-full hover:bg-[#169c46] transition-colors"
          >
            <MapPin className="h-5 w-5" />
            <span>View Map</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockRestaurants.map((restaurant) => (
            <Link
              to={`/restaurant/${restaurant.id}`}
              key={restaurant.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            >
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">{restaurant.name}</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span>{restaurant.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">{restaurant.address}</p>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{restaurant.availableHours.open} - {restaurant.availableHours.close}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {restaurant.cuisineType.map((type) => (
                    <span
                      key={type}
                      className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-8">Can't Decide? Let Us Pick For You!</h2>
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              {isSpinning ? (
                <div className="h-48 flex items-center justify-center">
                  <img
                    src={mockRestaurants[spinningIndex].image}
                    alt="Spinning"
                    className="w-full h-full object-cover animate-pulse"
                  />
                </div>
              ) : selectedRestaurant ? (
                <Link to={`/restaurant/${selectedRestaurant.id}`} className="block">
                  <img
                    src={selectedRestaurant.image}
                    alt={selectedRestaurant.name}
                    className="w-full h-48 object-cover mb-4"
                  />
                  <h3 className="text-xl font-semibold">{selectedRestaurant.name}</h3>
                  <p className="text-gray-600">{selectedRestaurant.address}</p>
                </Link>
              ) : (
                <div className="h-48 bg-gray-100 flex items-center justify-center">
                  <p className="text-gray-500">Click spin to find a restaurant</p>
                </div>
              )}
              <button
                onClick={handleSpin}
                disabled={isSpinning}
                className={`mt-6 w-full bg-[#1db954] text-white py-3 px-6 rounded-full text-lg font-semibold hover:bg-[#169c46] transition-colors ${
                  isSpinning ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSpinning ? 'Spinning...' : 'Spin!'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;