"use client";

import { useState, useEffect } from "react";
import RestaurantCard from "../components/RestaurantCard";
import Navbar from "../components/Navbar";
import Cookies from "js-cookie";
import { useLocation } from "../context/LocationContext";

export default function HomePage() {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [locations, setLocations] = useState([]); // Store location data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { selectedLocation } = useLocation(); // Get selected location from context

  useEffect(() => {
    // Fetch restaurants
    const fetchRestaurants = async () => {
      try {
        const token = Cookies.get("access_token");
        const response = await fetch(
          "http://127.0.0.1:8000/api/restaurants/all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch restaurants.");
        }

        const data = await response.json();
        setRestaurants(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Fetch locations
    const fetchLocations = async () => {
      try {
        const token = Cookies.get("access_token");
        const response = await fetch("http://127.0.0.1:8000/api/location/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch locations.");
        }

        const data = await response.json();
        setLocations(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchRestaurants();
    fetchLocations();
  }, []);

  useEffect(() => {
    // Find location ID from the selected city name
    const locationObj = locations.find(
      (location) => location.city === selectedLocation
    );
    const locationId = locationObj ? locationObj.id : null;

    if (locationId === null) {
      setFilteredRestaurants(restaurants); // Show all if no location is selected
    } else {
      const filtered = restaurants.filter(
        (restaurant) => restaurant.location === locationId
      );
      setFilteredRestaurants(filtered);
    }
  }, [selectedLocation, restaurants, locations]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Loading restaurants...</p>
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <h1 className="text-3xl font-bold text-center mb-10">Restaurants</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-5">
        {filteredRestaurants.map((restaurant, index) => (
          <RestaurantCard key={index} restaurant={restaurant} />
        ))}
      </div>
    </div>
  );
}
