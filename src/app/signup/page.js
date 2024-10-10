"use client"

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
      // Optionally redirect to login or other page
      router.push("/login");
    } else {
      setMessage(data.error || "Signup failed");
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone_number"
          placeholder="Phone Number"
          onChange={handleChange}
          required
        />
        <div>
          <label>
            <input
              type="radio"
              name="user_type"
              value="normal_user"
              checked={formData.user_type === "normal_user"}
              onChange={handleUserTypeChange}
            />
            Normal User
          </label>
          <label>
            <input
              type="radio"
              name="user_type"
              value="restaurant_owner"
              checked={formData.user_type === "restaurant_owner"}
              onChange={handleUserTypeChange}
            />
            Restaurant Owner
          </label>
        </div>
        <button type="submit">Sign Up</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
