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
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold mb-4 text-gray-800">
        Owner Dashboard
      </h1>

      {restaurantData ? (
        <div className="bg-white shadow-md p-6 rounded-lg border border-gray-200">
          <h3 className="text-3xl font-bold text-gray-800 mt-6 mb-4">
            Restaurants
          </h3>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            {restaurantData.name}
          </h2>
          <p className="text-gray-600 flex items-center">
            <FaClock className="mr-2" /> Location:{" "}
            {getLocationNameById(restaurantData.location)}
          </p>
          <p className="text-gray-600 flex items-center">
            <FaClock className="mr-2" /> Opening Time:{" "}
            {formatTimeToAMPM(restaurantData.opening_time)}
          </p>
          <p className="text-gray-600 flex items-center">
            <FaClock className="mr-2" /> Closing Time:{" "}
            {formatTimeToAMPM(restaurantData.closing_time)}
          </p>
          {restaurantData.image && (
            <img
              src={restaurantData.image}
              alt="Restaurant"
              className="w-full h-64 object-cover rounded-md my-4 shadow-md border border-gray-300"
            />
          )}

          <h3 className="text-3xl font-bold text-gray-800 mt-6 mb-4">
            Menu Items
          </h3>
          {menuItems?.length > 0 ? (
            <ul className="space-y-4">
              {menuItems.map((item) => (
                <li
                  key={item.id}
                  className="bg-gray-100 p-4 rounded-md shadow border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium text-gray-800">
                      {item.name}
                    </h4>
                    {/* <FaTrashAlt
                      className="text-red-600 cursor-pointer hover:text-red-800"
                      title="Delete Menu Item"
                    /> */}
                  </div>
                  <p className="text-gray-600">{item.description}</p>
                  <p className="text-gray-800 font-semibold">
                    Price: ${item.price}
                  </p>
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-32 object-cover rounded-md mt-2 shadow-md border border-gray-300"
                    />
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No menu items available.</p>
          )}

          <form onSubmit={addMenuItem} className="mt-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Add Menu Item
            </h3>
            <input
              type="text"
              name="name"
              placeholder="Item Name"
              value={newMenuItem.name}
              onChange={handleMenuItemChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md mb-2"
            />
            <input
              type="text"
              name="price"
              placeholder="Price"
              value={newMenuItem.price}
              onChange={handleMenuItemChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md mb-2"
            />
            <textarea
              name="description"
              placeholder="Description"
              value={newMenuItem.description}
              onChange={handleMenuItemChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md mb-2"
            />
            <input
              type="file"
              onChange={handleMenuImageChange}
              className="w-full mb-4"
              required
            />
            <button
              type="submit"
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
            >
              <FaPlusCircle className="mr-2" /> Add Menu Item
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-white shadow-md p-6 rounded-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Create a Restaurant
          </h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Restaurant Name"
              value={newRestaurantData.name}
              onChange={handleRestaurantChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md mb-2"
            />
            <select
              name="location"
              value={newRestaurantData.location}
              onChange={handleRestaurantChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md mb-2"
            >
              <option value="">Select Location</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.city}
                </option>
              ))}
            </select>
            <input
              type="time"
              name="opening_time"
              value={newRestaurantData.opening_time}
              onChange={handleRestaurantChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md mb-2"
            />
            <input
              type="time"
              name="closing_time"
              value={newRestaurantData.closing_time}
              onChange={handleRestaurantChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md mb-2"
            />
            <input
              type="file"
              onChange={handleImageChange}
              required
              className="w-full mb-4"
            />
            <button
              type="submit"
              className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200"
            >
              <FaPlusCircle className="mr-2" /> Create Restaurant
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
