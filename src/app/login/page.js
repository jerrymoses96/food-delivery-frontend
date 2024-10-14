"use client"; // Add this line

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"; // Ensure js-cookie is installed
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const router = useRouter();

  // Check for existing token on mount
  useEffect(() => {
    const token = Cookies.get("access_token");
    if (token) {
      router.push("/user-dashboard"); // Redirect if logged in
    }
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading to true
    const response = await fetch("http://127.0.0.1:8000/api/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    setIsLoading(false); // Set loading to false after response

    if (response.ok) {
      const data = await response.json();
      Cookies.set("access_token", data.access);
      Cookies.set("refresh_token", data.refresh);
      login();

      const userResponse = await fetch(
        "http://127.0.0.1:8000/api/user-details/",
        {
          headers: {
            Authorization: `Bearer ${data.access}`,
          },
        }
      );

      if (userResponse.ok) {
        const userDetails = await userResponse.json();
        if (userDetails.is_restaurant_owner) {
          router.push("/owner-dashboard");
        } else if (userDetails.is_normal_user) {
          router.push("/");
        }
      } else {
        setMessage("Failed to fetch user details.");
      }
    } else {
      const errorData = await response.json();
      setMessage(errorData.error || "Login failed. Please try again.");
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
          required
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
