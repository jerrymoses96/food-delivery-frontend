// src/app/restaurantmenu/[id]/page.js

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useCart } from "@/context/cartContext"; // Import the cart context
import toast, { Toaster } from "react-hot-toast"; // Import react-hot-toast

const RestaurantMenuPage = ({ params }) => {
  const router = useRouter();
  const { id } = params; // Restaurant ID from the URL
  const [menuItems, setMenuItems] = useState([]);
  const [restaurantDetails, setRestaurantDetails] = useState(null);
  const [locations, setLocations] = useState([]); // State to hold locations
  const { addToCart } = useCart(); // Use the cart context

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

  // Update the handleAddToCart function to trigger a toast notification
  const handleAddToCart = (itemId) => {
    const quantityInput = document.getElementById(`quantity-${itemId}`);
    const quantity = parseInt(quantityInput.value);

    const menuItem = menuItems.find((item) => item.id === itemId);
    if (menuItem) {
      addToCart({ ...menuItem, quantity }); // Add item with quantity

      // Trigger a toast notification when the item is added to the cart
      toast.success(`${menuItem.name} added to your cart!`, {
        duration: 3000, // Toast stays for 3 seconds
        style: {
          background: "#333", // Dark background
          color: "#fff", // White text
        },
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Toaster to show notifications */}
      <Toaster
        position="bottom-right" // Set position to bottom-right
        reverseOrder={false}
        toastOptions={{
          // Custom transition options
          success: {
            duration: 3000,
            style: {
              background: "#4caf50",
              color: "#fff",
            },
          },
          error: {
            duration: 3000,
            style: {
              background: "#f44336",
              color: "#fff",
            },
          },
        }}
      />

      {/* Restaurant Details */}
      {restaurantDetails ? (
        <div className="mb-8 border-b pb-4">
          <h1 className="text-4xl font-bold mb-2">{restaurantDetails.name}</h1>
          <p className="text-gray-600 text-lg">
            {getLocationName(restaurantDetails.location)}{" "}
            {/* Displaying location name */}
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
                <p className="font-bold text-xl mt-2">
                  ${parseFloat(item.price).toFixed(2)}
                </p>
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

export default RestaurantMenuPage;
