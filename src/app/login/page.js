"use client"; // Add this line

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"; // Ensure js-cookie is installed

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const router = useRouter();

  // Check for existing token on mount
  useEffect(() => {
    const token = Cookies.get("access_token");
    if (token) {
      // Redirect based on the user type, implement logic to fetch user data if necessary
      // For now, let's assume if there's a token, the user is logged in
      // You can add a fetch call to get user role if needed
      router.push("/user-dashboard"); // Or the respective dashboard
    }
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://127.0.0.1:8000/api/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const data = await response.json();
      // Store tokens in cookies
      Cookies.set("access_token", data.access);
      Cookies.set("refresh_token", data.refresh);

      // Fetch user details
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
          router.push("/user-dashboard");
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
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
