"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone_number: "",
    user_type: "normal_user", // Default to normal user
  });
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUserTypeChange = (e) => {
    setFormData({ ...formData, user_type: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://127.0.0.1:8000/api/signup/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        is_normal_user: formData.user_type === "normal_user",
        is_restaurant_owner: formData.user_type === "restaurant_owner",
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage("Signup successful!");
      router.push("/login");
    } else {
      setMessage(data.error || "Signup failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-4">Signup</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border rounded-md border-gray-300 shadow-sm focus:ring focus:ring-blue-200"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border rounded-md border-gray-300 shadow-sm focus:ring focus:ring-blue-200"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border rounded-md border-gray-300 shadow-sm focus:ring focus:ring-blue-200"
          />
          <input
            type="text"
            name="phone_number"
            placeholder="Phone Number"
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border rounded-md border-gray-300 shadow-sm focus:ring focus:ring-blue-200"
          />
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              User Type
            </label>
            <div className="flex space-x-4 mt-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="user_type"
                  value="normal_user"
                  checked={formData.user_type === "normal_user"}
                  onChange={handleUserTypeChange}
                  className="mr-2"
                />
                Normal User
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="user_type"
                  value="restaurant_owner"
                  checked={formData.user_type === "restaurant_owner"}
                  onChange={handleUserTypeChange}
                  className="mr-2"
                />
                Restaurant Owner
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Sign Up
          </button>
        </form>
        {message && (
          <p className="mt-4 text-red-500 text-sm text-center">{message}</p>
        )}
      </div>
    </div>
  );
}
