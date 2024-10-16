"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useLocation } from "../context/LocationContext";
import { useCart } from "@/context/cartContext"; // Import the cart context

const Navbar = () => {
  const router = useRouter();
  const { isLoggedIn, logout, userType } = useAuth();
  const { selectedLocation, setSelectedLocation } = useLocation();
  const { cartItems } = useCart(); // Access cart items from the context
  const [locations, setLocations] = useState([]);
  console.log(userType);

  const fetchLocations = async () => {
    const token = Cookies.get("access_token");
    const response = await fetch("http://127.0.0.1:8000/api/location/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setLocations(data);
    } else {
      setLocations([]); // Clear locations if fetch fails
    }
  };

  useEffect(() => {
    // Trigger fetching locations when userType changes or login status updates
    if (isLoggedIn && userType === "normal") {
      fetchLocations();
    } else {
      setLocations([]); // Clear locations for restaurant owners or logged-out users
    }
  }, [userType, isLoggedIn]); // Dependency on userType and isLoggedIn

  const handleLocationChange = (event) => {
    const location = event.target.value;
    setSelectedLocation(location);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Get the total count of items in the cart
  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <nav className=" bg-gray-800 text-white ">
      <div className="w-[95%] flex justify-between items-center py-4 mx-auto">
        <h1>Food Delivery App</h1>
        <ul className="flex gap-8 items-center">
          {/* Show Orders link only for restaurant owners */}
          {isLoggedIn && userType === "restaurant" && (
            <li>
              <Link href={"/owner-dashboard/orders"}>Orders</Link>
            </li>
          )}
          {/* Only show the following links if the user is a normal user */}
          {isLoggedIn && userType === "normal" && (
            <>
              <li>
                <Link href="/">Restaurants</Link>
              </li>
              <li>
                <Link href="/user-orders">Orders</Link>
              </li>
              <li className="relative">
                <Link href="/cart" className="flex items-center">
                  Cart
                  {cartItemCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-sm px-1 rounded-full">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
              </li>

              <li>
                {/* Location dropdown */}
                <select
                  value={selectedLocation}
                  className="bg-gray-700 text-white rounded-md p-2"
                  onChange={handleLocationChange}
                >
                  <option value="">Select Location</option>
                  {locations.map((location) => (
                    <option key={location.id} value={location.city}>
                      {location.city}
                    </option>
                  ))}
                </select>
              </li>
            </>
          )}

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
      </div>
    </nav>
  );
};

export default Navbar;
