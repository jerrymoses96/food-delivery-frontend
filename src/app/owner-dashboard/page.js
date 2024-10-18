"use client"; // Add this line

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

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
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-gray-700">Owner Dashboard</h1>

      {restaurantData ? (
        <div className="bg-white shadow-md p-6 rounded-lg">
          <h3 className="text-3xl font-bold text-gray-800 mt-6 mb-4">
            Restaurants
          </h3>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            {restaurantData.name}
          </h2>
          <p className="text-gray-600">Location: {restaurantData.location}</p>
          <p className="text-gray-600">
            Opening Time: {restaurantData.opening_time}
          </p>
          <p className="text-gray-600">
            Closing Time: {restaurantData.closing_time}
          </p>
          {restaurantData.image && (
            <img
              src={restaurantData.image}
              alt="Restaurant"
              className="w-full h-64 object-cover rounded-md my-4"
            />
          )}

          <h3 className="text-3xl font-bold text-gray-800 mt-6 mb-4">
            Menu Items
          </h3>
          {menuItems?.length > 0 ? (
            <ul className="space-y-4">
              {menuItems.map((item) => (
                <li key={item.id} className="bg-gray-100 p-4 rounded-md shadow">
                  <h4 className="text-lg font-medium text-gray-800">
                    {item.name}
                  </h4>
                  <p className="text-gray-600">{item.description}</p>
                  <p className="text-gray-800 font-semibold">
                    Price: ${item.price}
                  </p>
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-48 object-cover mt-2 rounded-md"
                    />
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No menu items available.</p>
          )}
        </div>
      ) : (
        <p className="text-gray-600 text-lg">
          No restaurant created yet. Please add a restaurant.
        </p>
      )}

      {/* Add Restaurant Form */}
      {!restaurantData && (
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white shadow-lg p-6 mt-6 rounded-lg"
        >
          <h2 className="text-2xl font-semibold text-gray-700">
            Add Restaurant
          </h2>
          <input
            type="text"
            name="name"
            value={newRestaurantData.name}
            onChange={handleRestaurantChange}
            placeholder="Restaurant Name"
            required
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring focus:ring-indigo-200"
          />
          <div>
            <label className="block text-gray-600 font-medium">Location</label>
            <select
              name="location"
              value={newRestaurantData.location}
              onChange={handleRestaurantChange}
              required
              className="border border-gray-300 rounded-lg p-3 w-full focus:ring focus:ring-indigo-200"
            >
              <option value="">Select Location</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.city}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-gray-600 font-medium">
                Opening Time
              </label>
              <input
                type="time"
                name="opening_time"
                value={newRestaurantData.opening_time}
                onChange={handleRestaurantChange}
                required
                className="border border-gray-300 rounded-lg p-3 w-full focus:ring focus:ring-indigo-200"
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-600 font-medium">
                Closing Time
              </label>
              <input
                type="time"
                name="closing_time"
                value={newRestaurantData.closing_time}
                onChange={handleRestaurantChange}
                required
                className="border border-gray-300 rounded-lg p-3 w-full focus:ring focus:ring-indigo-200"
              />
            </div>
          </div>
          <input
            type="file"
            onChange={handleImageChange}
            className="block w-full text-gray-700 mt-3"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
          >
            Add Restaurant
          </button>
        </form>
      )}

      {/* Add Menu Item Form */}
      {restaurantData && (
        <form
          onSubmit={addMenuItem}
          className="space-y-6 bg-white shadow-lg p-6 mt-6 rounded-lg"
        >
          <h2 className="text-2xl font-semibold text-gray-700">
            Add Menu Item
          </h2>
          <input
            type="text"
            name="name"
            value={newMenuItem.name}
            onChange={handleMenuItemChange}
            placeholder="Item Name"
            required
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring focus:ring-indigo-200"
          />
          <input
            type="number"
            name="price"
            value={newMenuItem.price}
            onChange={handleMenuItemChange}
            placeholder="Price"
            required
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring focus:ring-indigo-200"
          />
          <textarea
            name="description"
            value={newMenuItem.description}
            onChange={handleMenuItemChange}
            placeholder="Description"
            required
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring focus:ring-indigo-200"
          />
          <input
            type="file"
            onChange={handleMenuImageChange}
            className="block w-full text-gray-700 mt-3"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
          >
            Add Menu Item
          </button>
        </form>
      )}
    </div>
  );
}
