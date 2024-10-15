// components/RestaurantCard.js
import React from "react";
import Link from "next/link";

// Function to check if a restaurant is currently open
function isOpen(openingTime, closingTime) {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  const [openingHour, openingMinute] = openingTime.split(":").map(Number);
  const [closingHour, closingMinute] = closingTime.split(":").map(Number);

  const openingTimeInMinutes = openingHour * 60 + openingMinute;
  const closingTimeInMinutes = closingHour * 60 + closingMinute;

  // If current time is within opening and closing time, return true (open)
  return (
    currentTime >= openingTimeInMinutes && currentTime <= closingTimeInMinutes
  );
}

const RestaurantCard = ({ restaurant }) => {
  const { name, opening_time, closing_time, image } = restaurant;
  const open = isOpen(opening_time, closing_time);

  return (
    <Link href={`/restaurantmenu/${restaurant.id}`}>
      <div
        className={`p-4 border rounded-lg shadow-md transition-all ${
          open ? "bg-white" : "bg-gray-400 opacity-50"
        }`}
      >
        <img
          src={image}
          alt={name}
          className="w-full h-32 object-cover rounded-md mb-4"
        />
        <h2 className="text-xl font-bold">{name}</h2>
        <p>{open ? "Open Now" : "Closed"}</p>
      </div>
    </Link>
  );
};

export default RestaurantCard;
