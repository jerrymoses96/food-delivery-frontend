"use client"; // Ensure the component is a client component

import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

const Navbar = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in by verifying the presence of an access token
    const token = Cookies.get("access_token");
    setIsLoggedIn(!!token); // Convert the token into a boolean (true/false)
  }, []);

  const handleLogout = () => {
    // Remove tokens from cookies and log the user out
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    setIsLoggedIn(false);
    router.push("/login"); // Redirect to login page after logout
  };

  return (
    <nav className="flex justify-between items-center ">
      <h1>Food Delivery App</h1>
      <ul className="flex gap-28">
        
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/restaurants">Restaurants</Link>
        </li>
        <li>
          <Link href="/profile">Profile</Link>
        </li>
        {isLoggedIn ? (
          <li>
            <button onClick={handleLogout}>Logout</button>
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
