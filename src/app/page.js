"use client";
import { useState, useEffect } from "react";
import RestaurantCard from "../components/RestaurantCard";
import Navbar from "../components/Navbar";
import Cookies from "js-cookie";
import { useLocation } from "../context/LocationContext";
import Head from "next/head";

export default function HomePage() {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { selectedLocation } = useLocation();

  useEffect(() => {
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
    const locationObj = locations.find(
      (location) => location.city === selectedLocation
    );
    const locationId = locationObj ? locationObj.id : null;

    if (locationId === null) {
      setFilteredRestaurants(restaurants);
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
    <div className="min-h-screen py-10">
      <h1 className="text-4xl font-bold text-center mb-10">Restaurants</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-5">
        {filteredRestaurants.map((restaurant, index) => (
          <RestaurantCard
            key={index}
            restaurant={restaurant}
            locations={locations}
          />
        ))}
      </div>
    </div>
  );
}
