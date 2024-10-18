"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

const OwnerOrdersPage = () => {
  const token = Cookies.get("access_token");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create an Axios instance with the Authorization header
  const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8000/api/", // Base URL for your API
    headers: {
      Authorization: `Bearer ${token}`, // Include the Bearer token here
    },
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get("restaurant-orders/");
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axiosInstance.patch(`orders/${orderId}/`, {
        status: newStatus,
      });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-8 text-[#FF6600]">
        Your Orders
      </h1>
      <ul className="space-y-6">
        {orders.map((order) => (
          <li
            key={order.id}
            className="border rounded-lg shadow-md p-6 bg-white hover:shadow-xl transition-shadow duration-300"
          >
            <h2 className="text-2xl font-bold mb-2">Order ID: {order.id}</h2>
            <p className="text-gray-700 mb-1">
              Restaurant:{" "}
              <span className="font-semibold">{order.restaurant.name}</span>
            </p>
            <p className="text-gray-700 mb-1">
              Total Price:{" "}
              <span className="font-semibold">${order.total_price}</span>
            </p>
            <p className="text-gray-700 mb-1">
              Status:{" "}
              <span
                className={`font-semibold ${
                  order.status === "Delivered"
                    ? "text-green-600"
                    : order.status === "Shipped"
                    ? "text-blue-600"
                    : "text-yellow-600"
                }`}
              >
                {order.status}
              </span>
            </p>
            <p className="text-gray-700 mb-1">
              Created At: {new Date(order.created_at).toLocaleString()}
            </p>
            <p className="text-gray-700 mb-4">
              User: <span className="font-semibold">{order.user}</span>
            </p>
            {/* Display the username here */}
            <h3 className="font-semibold mb-2">Order Items:</h3>
            <ul className="list-disc ml-5 space-y-1">
              {order.order_items.map((item) => (
                <li key={item.id} className="flex justify-between">
                  <span>
                    {item.quantity} x {item.menu_item.name}
                  </span>
                  <span>${item.menu_item.price}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => updateOrderStatus(order.id, "packing")}
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg transition-transform transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
              >
                Packing
              </button>
              <button
                onClick={() => updateOrderStatus(order.id, "shipped")}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg transition-transform transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Shipped
              </button>
              <button
                onClick={() => updateOrderStatus(order.id, "delivered")}
                className="bg-green-500 text-white px-4 py-2 rounded-lg transition-transform transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              >
                Delivered
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OwnerOrdersPage;
