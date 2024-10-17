"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("access_token");
    if (token) {
      router.push("/user-dashboard");
    }
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const response = await fetch("http://127.0.0.1:8000/api/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    setIsLoading(false);

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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-4">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
              className="mt-1 block w-full p-2 border rounded-md border-gray-300 shadow-sm focus:ring focus:ring-purple-200"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="mt-1 block w-full p-2 border rounded-md border-gray-300 shadow-sm focus:ring focus:ring-purple-200"
            />
          </div>
          {message && <p className="text-red-500 text-sm">{message}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-600 text-white p-2 rounded-md hover:bg-purple-700 transition duration-200"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
