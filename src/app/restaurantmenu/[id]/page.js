"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const RestaurantMenuPage = ({ params }) => {
  const router = useRouter();
  const { id } = params; // Restaurant ID from the URL
  const [menuItems, setMenuItems] = useState([]);
  const [restaurantDetails, setRestaurantDetails] = useState(null);
  const [locations, setLocations] = useState([]); // State to hold locations

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const token = Cookies.get("access_token"); // Get token if needed for other secure calls

        // Fetch all restaurants
        const restaurantRes = await fetch(
          `http://127.0.0.1:8000/api/restaurants/all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const allRestaurants = await restaurantRes.json();

        // Fetch all locations
        const locationRes = await fetch(`http://127.0.0.1:8000/api/location`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const locationData = await locationRes.json();
        setLocations(locationData); // Set locations data

        // Find the specific restaurant by ID
        const specificRestaurant = allRestaurants.find(
          (restaurant) => restaurant.id === parseInt(id)
        );
        setRestaurantDetails(specificRestaurant); // Set specific restaurant details

        // Fetch menu items for the selected restaurant
        const menuRes = await fetch(
          `http://127.0.0.1:8000/api/menu-items/${id}/`
        );
        const menuData = await menuRes.json();
        setMenuItems(menuData);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };

    fetchMenuItems();
  }, [id]);

  // Function to get location name by ID
  const getLocationName = (locationId) => {
    const location = locations.find((loc) => loc.id === locationId);
    return location ? location.city : "Unknown Location"; // Fallback to "Unknown Location" if not found
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Restaurant Details */}
      {restaurantDetails ? (
        <div className="mb-8 border-b pb-4">
          <h1 className="text-4xl font-bold mb-2">{restaurantDetails.name}</h1>
          <p className="text-gray-600 text-lg">
            {getLocationName(restaurantDetails.location)} {/* Displaying location name */}
          </p>
          <img
            src={restaurantDetails.image}
            alt={restaurantDetails.name}
            className="w-full h-64 object-cover rounded-lg mt-4"
          />
        </div>
      ) : (
        <p>Loading restaurant details...</p>
      )}

      {/* Menu Items */}
      <h2 className="text-3xl font-bold mt-4">Menu Items</h2>
      {menuItems.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {menuItems.map((item) => (
            <li
              key={item.id}
              className="border shadow-md rounded-lg overflow-hidden"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-gray-700">{item.description}</p>
                <p className="font-bold text-xl mt-2">${item.price}</p>
                <div className="mt-4 flex items-center">
                  <label htmlFor={`quantity-${item.id}`} className="mr-2">
                    Quantity:
                  </label>
                  <input
                    id={`quantity-${item.id}`}
                    type="number"
                    min="1"
                    defaultValue="1"
                    className="w-16 p-1 border rounded-md"
                  />
                  <button
                    onClick={() => handleAddToCart(item.id)}
                    className="bg-blue-500 text-white p-2 rounded-md ml-2 hover:bg-blue-600 transition duration-200"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4">No menu items available for this restaurant.</p>
      )}
    </div>
  );
};

const handleAddToCart = (itemId) => {
  // Add logic for adding items to cart
  console.log("Add to cart:", itemId);
};

export default RestaurantMenuPage;
