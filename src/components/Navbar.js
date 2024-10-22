"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Cookies from "js-cookie";
import { useEffect, useState, useRef } from "react";
import { useLocation } from "../context/LocationContext";
import { useCart } from "@/context/cartContext";

const Navbar = () => {
  const router = useRouter();
  const { isLoggedIn, logout, userType } = useAuth();
  const { selectedLocation, setSelectedLocation } = useLocation();
  const { cartItems } = useCart();
  const [locations, setLocations] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef(null); // Ref for the menu container
  const hamburgerRef = useRef(null); // Ref for the hamburger button

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
    if (isLoggedIn && userType === "normal") {
      fetchLocations();
    } else {
      setLocations([]); // Clear locations for restaurant owners or logged-out users
    }
  }, [userType, isLoggedIn]);

  const handleLocationChange = (event) => {
    const location = event.target.value;
    setSelectedLocation(location);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
    setMenuOpen(false); // Close menu after logout
  };

  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Close menu when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside the menu and not on the hamburger button
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef, hamburgerRef]);

  return (
    <nav className="bg-gray-800 text-white">
      <div className=" flex justify-between items-center py-6 mx-auto w-[95%] ">
        <h1 className="text-2xl font-bold">
          <Link href={userType === "normal" ? "/" : "/owner-dashboard"}>
            Food Delivery App
          </Link>
        </h1>

        <button
          ref={hamburgerRef} // Attach ref to hamburger button
          className="lg:hidden text-white text-3xl focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          &#9776;
        </button>
        <ul
          ref={menuRef} // Attach ref to the menu container
          className={`flex flex-col lg:flex-row gap-6 items-center lg:static absolute bg-gray-800 w-full z-20   lg:w-auto transition-all duration-300 ease-in-out ${
            menuOpen ? "top-20 pb-10" : "-top-full"
          }`}
        >
          {/* Show Dashboard and Orders only for restaurant owners */}
          {isLoggedIn && userType === "restaurant" && (
            <>
              <li>
                <Link href="/owner-dashboard" className="hover:text-gray-300">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/owner-dashboard/orders"
                  className="hover:text-gray-300"
                >
                  Orders
                </Link>
              </li>
            </>
          )}

          {/* Normal user links: Restaurants, Orders, Cart, Location selector */}
          {isLoggedIn && userType === "normal" && (
            <>
              <li>
                <Link href="/" className="hover:text-gray-300">
                  Restaurants
                </Link>
              </li>
              <li>
                <Link href="/user-orders" className="hover:text-gray-300">
                  Orders
                </Link>
              </li>
              <li className="relative">
                <Link
                  href="/cart"
                  className="flex items-center hover:text-gray-300"
                >
                  Cart
                  {cartItemCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
              </li>

              <li>
                <select
                  value={selectedLocation}
                  onChange={handleLocationChange}
                  className="bg-gray-700 text-white rounded-md p-2 border border-gray-600 hover:border-gray-400"
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

          {/* Authentication Links */}
          {isLoggedIn ? (
            <li>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-500 text-white rounded-md px-4 py-2 transition duration-200"
              >
                Logout
              </button>
            </li>
          ) : (
            <>
              <li>
                <Link href="/login" className="hover:text-gray-300">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-gray-300">
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
