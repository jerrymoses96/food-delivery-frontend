"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useCart } from "@/context/cartContext"; // Import the cart context
import {toast} from "react-hot-toast"; // Import react-hot-toast

const RestaurantMenuPage = ({ params }) => {
  const router = useRouter();
  const { id } = params; // Restaurant ID from the URL
  const [menuItems, setMenuItems] = useState([]);
  const [restaurantDetails, setRestaurantDetails] = useState(null);
  const [locations, setLocations] = useState([]); // State to hold locations
  const { addToCart } = useCart(); // Use the cart context

  // Utility function to convert time to AM/PM format
  const formatTime = (time) => {
    const [hour, minute] = time.split(":");
    const hours = parseInt(hour, 10);
    const minutesFormatted = minute.padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHour = hours % 12 || 12;
    return `${formattedHour}:${minutesFormatted} ${ampm}`;
  };

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const token = Cookies.get("access_token");

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
        setLocations(locationData);

        // Find the specific restaurant by ID
        const specificRestaurant = allRestaurants.find(
          (restaurant) => restaurant.id === parseInt(id)
        );
        setRestaurantDetails(specificRestaurant);
        console.log(restaurantDetails);

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

  const getLocationName = (locationId) => {
    const location = locations.find((loc) => loc.id === locationId);
    return location ? location.city : "Unknown Location";
  };

  const handleAddToCart = (itemId) => {
    const quantityInput = document.getElementById(`quantity-${itemId}`);
    const quantity = parseInt(quantityInput.value);

    const menuItem = menuItems.find((item) => item.id === itemId);
    if (menuItem) {
      addToCart({ ...menuItem, quantity });

      toast.success(`${menuItem.name} added to your cart!`, {
        duration: 3000,
        style: {
          background: "#333",
          color: "#fff",
        },
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <style jsx>{`
        /* Hide the spinner arrows for number inputs in Chrome, Safari, and Edge */
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        /* Hide the spinner arrows for number inputs in Firefox */
        input[type="number"] {
          -moz-appearance: textfield; /* Remove arrows in Firefox */
        }
      `}</style>

      {restaurantDetails ? (
        <div className="mb-8 border-b pb-4 text-center bg-gray-100 rounded-lg shadow-md p-4">
          <h1 className="text-4xl font-bold mb-2 ">{restaurantDetails.name}</h1>
          <p className="text-gray-700 text-lg mb-2">
            {getLocationName(restaurantDetails.location)}
          </p>
          <img
            src={restaurantDetails.image}
            alt={restaurantDetails.name}
            className="w-full h-64 object-cover rounded-lg mt-4 shadow-lg border border-gray-300"
          />
          <div className="mt-4">
            <p className="text-gray-500 italic">
              Delicious food served with love!
            </p>
            <div className="flex justify-center items-center mt-2">
              <div className="bg-green-100 text-green-800 p-2 rounded-md mx-2">
                <strong>Open:</strong>{" "}
                {formatTime(restaurantDetails.opening_time)}
              </div>
              <div className="bg-red-100 text-red-800 p-2 rounded-md mx-2">
                <strong>Close:</strong>{" "}
                {formatTime(restaurantDetails.closing_time)}
              </div>
            </div>
            <p className="text-gray-600 mt-2">
              Estimated Delivery Time: <strong>20 mins</strong>
            </p>
          </div>
        </div>
      ) : (
        <p>Loading restaurant details...</p>
      )}

      <h2 className="text-3xl font-bold mt-4">Menu Items</h2>
      {menuItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105"
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
                  {/* Decrement Button */}
                  <button
                    onClick={() => {
                      const quantityInput = document.getElementById(
                        `quantity-${item.id}`
                      );
                      let quantity = parseInt(quantityInput.value);
                      if (quantity > 1) {
                        quantityInput.value = quantity - 1;
                      }
                    }}
                    className="bg-gray-200 text-gray-800 p-2 rounded-l-md border border-gray-400 hover:bg-gray-300 transition duration-200"
                  >
                    -
                  </button>
                  {/* Quantity Input */}
                  <input
                    id={`quantity-${item.id}`}
                    type="number"
                    min="1"
                    defaultValue="1"
                    className="w-12 p-2 border-t border-b border-gray-400 text-center rounded-none focus:outline-none focus:ring focus:border-blue-300"
                  />
                  {/* Increment Button */}
                  <button
                    onClick={() => {
                      const quantityInput = document.getElementById(
                        `quantity-${item.id}`
                      );
                      let quantity = parseInt(quantityInput.value);
                      quantityInput.value = quantity + 1;
                    }}
                    className="bg-gray-200 text-gray-800 p-2 rounded-r-md border border-gray-400 hover:bg-gray-300 transition duration-200"
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleAddToCart(item.id)}
                    className="bg-blue-500 text-white p-2 rounded-md ml-2 hover:bg-blue-600 transition duration-200"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4">No menu items available for this restaurant.</p>
      )}
    </div>
  );
};

export default RestaurantMenuPage;
