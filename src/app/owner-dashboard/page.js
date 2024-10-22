"use client"; // Add this line

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { FaPlusCircle, FaClock, FaUtensils, FaTrashAlt } from "react-icons/fa";

export default function OwnerDashboard() {
  const [locations, setLocations] = useState([]);
  const [restaurantData, setRestaurantData] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [newRestaurantData, setNewRestaurantData] = useState({
    name: "",
    location: "",
    opening_time: "",
    closing_time: "",
    image: null,
  });
  const [newMenuItem, setNewMenuItem] = useState({
    name: "",
    price: "",
    description: "",
    image: null,
  });
  const [updatedTimes, setUpdatedTimes] = useState({
    opening_time: "",
    closing_time: "",
  });

  const router = useRouter();

  // Fetch existing restaurant and menu items on component mount
  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get("access_token");

      if (!token) {
        router.push("/login"); // Redirect to login if no token found
        return;
      }

      try {
        // Fetch restaurant data
        const restaurantResponse = await fetch(
          "http://127.0.0.1:8000/api/restaurants/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!restaurantResponse.ok)
          throw new Error("Failed to fetch restaurant data");

        const restaurantData = await restaurantResponse.json();
        setRestaurantData(restaurantData[0] || null); // Set the first restaurant or null if no data

        // If restaurant exists, fetch its menu items
        if (restaurantData[0]) {
          const restaurantId = restaurantData[0].id;
          const menuResponse = await fetch(
            `http://127.0.0.1:8000/api/menu-items/?restaurant=${restaurantId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!menuResponse.ok) throw new Error("Failed to fetch menu items");

          const menuData = await menuResponse.json();
          setMenuItems(menuData);
        }

        // Fetch location data
        const locationsResponse = await fetch(
          "http://127.0.0.1:8000/api/location/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!locationsResponse.ok) throw new Error("Failed to fetch locations");

        const locationsData = await locationsResponse.json();
        setLocations(locationsData);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, [router]);

  // Helper function to find the location name by ID
  const getLocationNameById = (id) => {
    const location = locations.find((loc) => loc.id === id);
    return location ? location.city : "Unknown location";
  };

  // Utility function to convert 24-hour time to 12-hour AM/PM format
  const formatTimeToAMPM = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
    return `${formattedHours}:${
      minutes < 10 ? "0" + minutes : minutes
    } ${ampm}`;
  };

  const handleRestaurantChange = (e) => {
    const { name, value } = e.target;
    setNewRestaurantData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewRestaurantData((prev) => ({ ...prev, image: file }));
  };

  const handleMenuItemChange = (e) => {
    const { name, value } = e.target;
    setNewMenuItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleMenuImageChange = (e) => {
    const file = e.target.files[0];
    setNewMenuItem((prev) => ({ ...prev, image: file }));
  };

  const addMenuItem = async (e) => {
    e.preventDefault();

    if (!restaurantData) {
      console.error("No restaurant data available.");
      return;
    }

    const formData = new FormData();
    formData.append("name", newMenuItem.name);
    formData.append("price", newMenuItem.price);
    formData.append("description", newMenuItem.description);
    formData.append("image", newMenuItem.image);
    formData.append("restaurant", restaurantData.id);

    const token = Cookies.get("access_token");
    try {
      const response = await fetch("http://127.0.0.1:8000/api/menu-item/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to add menu item");

      const newItem = await response.json();
      setMenuItems((prev) => [...prev, newItem]);

      // Reset form fields
      setNewMenuItem({ name: "", price: "", description: "", image: null });
    } catch (error) {
      console.error("Error adding menu item:", error.message);
    }
  };

  const handleUpdateTimes = async (e) => {
    e.preventDefault();
    const token = Cookies.get("access_token");

    try {
      const response = await fetch(
        `http://localhost:8000/api/restaurant/${restaurantData.id}/`,
        {
          method: "PATCH", // Use PATCH for partial updates
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include JWT token here
          },
          body: JSON.stringify({
            opening_time: updatedTimes.opening_time,
            closing_time: updatedTimes.closing_time,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update restaurant times.");
      }

      const data = await response.json();
      console.log("Times updated:", data);
    } catch (error) {
      console.error("Error updating times:", error);
    }
  };

  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    setUpdatedTimes((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", newRestaurantData.name);
    formData.append("location", newRestaurantData.location);
    formData.append("opening_time", newRestaurantData.opening_time);
    formData.append("closing_time", newRestaurantData.closing_time);
    formData.append("image", newRestaurantData.image);

    const token = Cookies.get("access_token");
    try {
      const restaurantResponse = await fetch(
        "http://127.0.0.1:8000/api/restaurant/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!restaurantResponse.ok)
        throw new Error("Failed to create restaurant");

      const newRestaurant = await restaurantResponse.json();
      setRestaurantData(newRestaurant);
      setNewRestaurantData({
        name: "",
        location: "",
        opening_time: "",
        closing_time: "",
        image: null,
      });

      router.push("/owner-dashboard"); // Redirect after successful creation
    } catch (error) {
      console.error("Error creating restaurant:", error.message);
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gray-100">
      <h1 className="text-4xl font-extrabold mb-4 text-gray-800">
        Owner Dashboard
      </h1>

      {restaurantData ? (
        <div className="bg-white shadow-lg p-6 rounded-lg border border-gray-200">
          <h3 className="text-3xl font-bold text-gray-800 mt-6 mb-4">
            Restaurants
          </h3>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            {restaurantData.name}
          </h2>
          <p className="text-gray-600 flex items-center">
            <FaClock className="mr-2" />
            Opening Time: {formatTimeToAMPM(restaurantData.opening_time)} -
            Closing Time: {formatTimeToAMPM(restaurantData.closing_time)}
          </p>
          <p className="text-gray-600 mb-2">
            Location: {getLocationNameById(restaurantData.location)}
          </p>
          <img
            src={restaurantData.image}
            alt={restaurantData.name}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />

          <h3 className="text-xl font-semibold text-gray-800">Menu Items</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-40 object-cover rounded-lg"
                />
                <h3 className="text-lg font-semibold text-gray-800 mt-2">
                  {item.name}
                </h3>
                <p className="text-gray-600">${item.price}</p>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>

          <h3 className="text-3xl font-semibold text-gray-800 mt-6 mb-4">
            Update Opening and Closing Times
          </h3>
          <form
            onSubmit={handleUpdateTimes}
            className="bg-white shadow-md rounded-lg p-6"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="mb-4 w-full md:w-1/2">
                <label
                  htmlFor="opening_time"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Opening Time
                </label>
                <input
                  type="time"
                  name="opening_time"
                  value={updatedTimes.opening_time}
                  onChange={handleTimeChange}
                  className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition duration-150 ease-in-out"
                />
              </div>

              <div className="mb-4 w-full md:w-1/2">
                <label
                  htmlFor="closing_time"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Closing Time
                </label>
                <input
                  type="time"
                  name="closing_time"
                  value={updatedTimes.closing_time}
                  onChange={handleTimeChange}
                  className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition duration-150 ease-in-out"
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
            >
              Update Times
            </button>
          </form>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-4">Create Restaurant</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Restaurant Name
              </label>
              <input
                type="text"
                name="name"
                value={newRestaurantData.name}
                onChange={handleRestaurantChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700"
              >
                Location
              </label>
              <select
                name="location"
                value={newRestaurantData.location}
                onChange={handleRestaurantChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              >
                <option value="">Select Location</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.city}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="mb-4">
                <label
                  htmlFor="opening_time"
                  className="block text-sm font-medium text-gray-700"
                >
                  Opening Time
                </label>
                <input
                  type="time"
                  name="opening_time"
                  value={newRestaurantData.opening_time}
                  onChange={handleRestaurantChange}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="closing_time"
                  className="block text-sm font-medium text-gray-700"
                >
                  Closing Time
                </label>
                <input
                  type="time"
                  name="closing_time"
                  value={newRestaurantData.closing_time}
                  onChange={handleRestaurantChange}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700"
              >
                Restaurant Image
              </label>
              <input
                type="file"
                name="image"
                onChange={handleImageChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                accept="image/*"
                required
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500"
            >
              Create Restaurant
            </button>
          </form>
        </div>
      )}

      {restaurantData && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Add Menu Item</h2>
          <form onSubmit={addMenuItem}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Item Name
              </label>
              <input
                type="text"
                name="name"
                value={newMenuItem.name}
                onChange={handleMenuItemChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                Price
              </label>
              <input
                type="number"
                name="price"
                value={newMenuItem.price}
                onChange={handleMenuItemChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                name="description"
                value={newMenuItem.description}
                onChange={handleMenuItemChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700"
              >
                Menu Item Image
              </label>
              <input
                type="file"
                name="image"
                onChange={handleMenuImageChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                accept="image/*"
                required
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500"
            >
              Add Menu Item
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
