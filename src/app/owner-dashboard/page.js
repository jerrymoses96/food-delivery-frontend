"use client"; // Add this line

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function OwnerDashboard() {
  const [locations, setLocations] = useState([]);
  const [restaurantData, setRestaurantData] = useState([]);
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
      console.log("Token:", token);

      // Fetch restaurant data
      const restaurantResponse = await fetch(
        "http://127.0.0.1:8000/api/restaurants/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (restaurantResponse.ok) {
        const data = await restaurantResponse.json();
        console.log(data);
        setRestaurantData(data);

        // Assuming data is an array and you're fetching the first restaurant
        const restaurantId = data[0]?.id;

        // Now fetch menu items for this restaurant
        if (restaurantId) {
          const menuResponse = await fetch(
            `http://127.0.0.1:8000/api/menu-items/?restaurant=${restaurantId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (menuResponse.ok) {
            const menuData = await menuResponse.json();
            setMenuItems(menuData);
          } else {
            console.error(
              "Failed to fetch menu items:",
              menuResponse.statusText
            );
          }
        }
      } else {
        console.error(
          "Failed to fetch restaurant data:",
          restaurantResponse.statusText
        );
      }

      // Fetch locations data
      const locationsResponse = await fetch(
        "http://127.0.0.1:8000/api/location/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (locationsResponse.ok) {
        const locationsData = await locationsResponse.json();
        setLocations(locationsData); // Assuming this is an array of locations
      } else {
        console.error(
          "Failed to fetch locations:",
          locationsResponse.statusText
        );
      }
    };

    fetchData();
  }, []);
  console.log(restaurantData);
  console.log(menuItems);

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

    const formData = new FormData();
    formData.append("name", newMenuItem.name);
    formData.append("price", newMenuItem.price);
    formData.append("description", newMenuItem.description);
    formData.append("image", newMenuItem.image);

    const restaurantId = parseInt(restaurantData[0]?.id); // Assuming restaurantData is an array and you're fetching the first restaurant
    formData.append("restaurant", restaurantId); // Append the restaurant ID as an integer

    const token = Cookies.get("access_token");
    const response = await fetch("http://127.0.0.1:8000/api/menu-item/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.ok) {
      const newItem = await response.json();

      // This is where you update the state with the new menu item
      setMenuItems((prev) => {
        if (!Array.isArray(prev)) {
          console.error("Previous menu items are not an array:", prev);
          return [newItem]; // Start fresh with the new item if prev is not an array
        }
        return [...prev, newItem];
      });

      // Clear the form fields after adding the menu item
      setNewMenuItem({ name: "", price: "", description: "", image: null });
    } else {
      console.error("Error adding menu item:", response.statusText);
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

    // Create restaurant
    const token = Cookies.get("access_token");
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

    if (restaurantResponse.ok) {
      router.push("/owner-dashboard"); // Redirect after successful creation
    } else {
      console.error(
        "Error creating restaurant:",
        restaurantResponse.statusText
      );
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Owner Dashboard</h1>
      {restaurantData ? (
        <div>
          <h2>{restaurantData[0]?.name}</h2>
          <p>Location: {restaurantData[0]?.location}</p>
          <p>Opening Time: {restaurantData[0]?.opening_time}</p>
          <p>Closing Time: {restaurantData[0]?.closing_time}</p>
          {restaurantData.image && (
            <img src={restaurantData[0]?.image} alt="Restaurant" />
          )}

          <h3>Menu Items</h3>

          {menuItems?.length > 0 ? (
            <ul>
              {menuItems.map((item) => (
                <li key={item.id}>
                  <h4>{item.name}</h4>
                  <p>{item.description}</p>
                  <p>Price: ${item.price}</p>
                  {item.image && <img src={item.image} alt={item.name} />}
                </li>
              ))}
            </ul>
          ) : (
            <p>No menu items available.</p>
          )}
        </div>
      ) : (
        <p>Loading restaurant data...</p>
      )}
      <h3>Available Locations</h3>
      {locations.length > 0 ? (
        <ul>
          {locations.map((location) => (
            <li key={location.id}>{location.city}</li>
          ))}
        </ul>
      ) : (
        <p>No locations available.</p>
      )}
      <h2 className="text-2xl font-semibold mb-4">Add Restaurant</h2>
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <input
          type="text"
          name="name"
          value={newRestaurantData.name}
          onChange={handleRestaurantChange}
          placeholder="Restaurant Name"
          required
          className="border border-gray-300 rounded p-2 w-full"
        />
        <label className="block">
          Location:
          <select
            name="location"
            value={newRestaurantData.location}
            onChange={handleRestaurantChange}
            required
            className="border border-gray-300 rounded p-2 w-full"
          >
            <option value="">Select Location</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.city}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          Opening Time:
          <input
            type="time"
            name="opening_time"
            value={newRestaurantData.opening_time}
            onChange={handleRestaurantChange}
            required
            className="border border-gray-300 rounded p-2 w-full"
          />
        </label>
        <label className="block">
          Closing Time:
          <input
            type="time"
            name="closing_time"
            value={newRestaurantData.closing_time}
            onChange={handleRestaurantChange}
            required
            className="border border-gray-300 rounded p-2 w-full"
          />
        </label>
        <input
          type="file"
          onChange={handleImageChange}
          accept="image/*"
          className="border border-gray-300 rounded p-2 w-full"
        />
        {newRestaurantData.image && (
          <img
            src={URL.createObjectURL(newRestaurantData.image)}
            alt="Restaurant Preview"
            className="h-40 w-full object-cover mt-2"
          />
        )}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>

      <h2 className="text-2xl font-semibold mb-4">Add Menu Item</h2>
      <form onSubmit={addMenuItem} className="space-y-4">
        <input
          type="text"
          name="name"
          value={newMenuItem.name}
          onChange={handleMenuItemChange}
          placeholder="Menu Item Name"
          required
          className="border border-gray-300 rounded p-2 w-full"
        />
        <input
          type="number"
          name="price"
          value={newMenuItem.price}
          onChange={handleMenuItemChange}
          placeholder="Price"
          required
          className="border border-gray-300 rounded p-2 w-full"
        />
        <textarea
          name="description"
          value={newMenuItem.description}
          onChange={handleMenuItemChange}
          placeholder="Description"
          required
          className="border border-gray-300 rounded p-2 w-full"
        />
        <input
          type="file"
          onChange={handleMenuImageChange}
          accept="image/*"
          className="border border-gray-300 rounded p-2 w-full"
        />
        {newMenuItem.image && (
          <img
            src={URL.createObjectURL(newMenuItem.image)}
            alt="Menu Item Preview"
            className="h-40 w-full object-cover mt-2"
          />
        )}
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Menu Item
        </button>
      </form>
    </div>
  );
}
