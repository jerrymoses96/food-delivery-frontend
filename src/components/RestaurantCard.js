import React from "react";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import { toast } from "react-hot-toast"; // Importing react-hot-toast

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

// Function to calculate minutes until the restaurant opens
function minutesUntilOpen(openingTime) {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  const [openingHour, openingMinute] = openingTime.split(":").map(Number);
  const openingTimeInMinutes = openingHour * 60 + openingMinute;

  // Calculate minutes until opening
  const minutesUntilOpen = openingTimeInMinutes - currentTime;

  // If already past opening time, return a positive number of minutes until the next opening time (e.g., 24 hours later)
  return minutesUntilOpen >= 0 ? minutesUntilOpen : 1440 + minutesUntilOpen; // 1440 minutes in a day
}

// Function to format time into hours and minutes
function formatTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours} hour${hours !== 1 ? "s" : ""} ${remainingMinutes} minute${
    remainingMinutes !== 1 ? "s" : ""
  }`;
}

const RestaurantCard = ({ restaurant, locations }) => {
  const { name, opening_time, closing_time, image, location } = restaurant;
  const open = isOpen(opening_time, closing_time);

  // Find location name using the location ID
  const locationName =
    locations.find((loc) => loc.id === location)?.city || "Unknown Location";

  // Dummy data for delivery time and rating
  const deliveryTime = "30-40 mins";
  const rating = 4.5;

  // Function to handle notification click
  const handleNotificationClick = () => {
    if (!open) {
      const minutes = minutesUntilOpen(opening_time);
      const timeMessage = formatTime(minutes);
      toast(`Restaurant will open in ${timeMessage}!`, {
        duration: 5000, // Duration of the toast
        icon: "🔔", // Optional icon
      });
    }
  };

  return (
    <div
      className={`p-4 border rounded-lg shadow-lg transition-all transform hover:scale-105 ${
        open ? "bg-white" : "bg-gray-400 opacity-70 cursor-not-allowed"
      }`}
      onClick={handleNotificationClick}
    >
      {open ? (
        <Link href={`/restaurantmenu/${restaurant.id}`}>
          <img
            src={image}
            alt={name}
            className="w-full h-40 object-cover rounded-md mb-4"
          />
          <h2 className="text-xl font-bold text-gray-800 mb-1">{name}</h2>

          {/* Displaying the location */}
          <p className="text-sm text-gray-600 mb-1">{locationName}</p>

          {/* Displaying delivery time */}
          <p className="text-sm text-gray-500 mb-1">
            <span className="font-semibold">Delivery Time:</span> {deliveryTime}
          </p>

          {/* Displaying rating */}
          <div className="flex items-center mb-1">
            <span className="flex text-yellow-500">
              {Array.from({ length: 5 }, (_, index) => (
                <FaStar
                  key={index}
                  className={
                    index < rating ? "text-yellow-500" : "text-gray-300"
                  }
                />
              ))}
            </span>
            <span className="ml-2 text-sm text-gray-600">{rating}</span>
          </div>

          <p
            className={`text-sm font-semibold ${
              open ? "text-green-600" : "text-red-600"
            }`}
          >
            {open ? "Open Now" : "Closed"}
          </p>
        </Link>
      ) : (
        <>
          <img
            src={image}
            alt={name}
            className="w-full h-40 object-cover rounded-md mb-4"
          />
          <h2 className="text-xl font-bold text-gray-800 mb-1">{name}</h2>

          {/* Displaying the location */}
          <p className="text-sm text-gray-600 mb-1">{locationName}</p>

          {/* Displaying delivery time */}
          <p className="text-sm text-gray-500 mb-1">
            <span className="font-semibold">Delivery Time:</span> {deliveryTime}
          </p>

          {/* Displaying rating */}
          <div className="flex items-center mb-1">
            <span className="flex text-yellow-500">
              {Array.from({ length: 5 }, (_, index) => (
                <FaStar
                  key={index}
                  className={
                    index < rating ? "text-yellow-500" : "text-gray-300"
                  }
                />
              ))}
            </span>
            <span className="ml-2 text-sm text-gray-600">{rating}</span>
          </div>

          <p
            className={`text-sm font-semibold ${
              open ? "text-green-600" : "text-red-600"
            }`}
          >
            {open ? "Open Now" : "Closed"}
          </p>
        </>
      )}
    </div>
  );
};

export default RestaurantCard;
