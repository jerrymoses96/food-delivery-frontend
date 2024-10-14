"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useLocation } from "../context/LocationContext"; // Import the Location context

const Navbar = () => {
  const router = useRouter();
  const { isLoggedIn, logout } = useAuth();
  
  const { selectedLocation, setSelectedLocation } = useLocation(); // Use location context
  const [locations, setLocations] = useState([]);

  // Fetch locations from the backend
  useEffect(() => {
    const fetchLocations = async () => {
      const token = Cookies.get("access_token");
      const response = await fetch("http://127.0.0.1:8000/api/location/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setLocations(data);
    };

    fetchLocations();
  }, []);

  // Handle location change and update context
  const handleLocationChange = (event) => {
    const location = event.target.value;
    setSelectedLocation(location); // Update the selected location in the context
  };

  const handleLogout = () => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    logout();
    router.push("/login");
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <h1>Food Delivery App</h1>
      <ul className="flex gap-8 items-center">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/restaurants">Restaurants</Link>
        </li>
        <li>
          <Link href="/profile">Profile</Link>
        </li>
        <li>
          {/* Location dropdown */}
          <select
            value={selectedLocation}
            onChange={handleLocationChange}
            className="bg-gray-700 text-white rounded-md p-2"
          >
            <option value="">Select Location</option>
            {locations.map((location) => (
              <option key={location.id} value={location.city}>
                {location.city}
              </option>
            ))}
          </select>
        </li>
        {isLoggedIn ? (
          <li>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white rounded-md p-2"
            >
              Logout
            </button>
          </li>
        ) : (
          <>
            <li>
              <Link href="/login">Login</Link>
            </li>
            <li>
              <Link href="/signup">Sign Up</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
