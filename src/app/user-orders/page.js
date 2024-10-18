"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { FaShoppingCart } from "react-icons/fa"; // Importing an icon

function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = Cookies.get("access_token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/user-details/", {
          // Adjust the endpoint based on your backend
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }

        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching user:", error);
      }
    };

    const fetchOrders = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/orders/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        setOrders(data);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    fetchOrders();
  }, [token]);

  console.log(orders);

  if (loading) {
    return <p className="text-center mt-4">Loading...</p>;
  }

  return (
    <div className="container mx-auto my-4">
      <h1 className="text-2xl font-bold mb-4">
        {user ? `Hello ${user.username}, here are your orders:` : "Your Orders"}
      </h1>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : orders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg p-4 shadow-lg transition-transform transform hover:scale-105"
              style={{ backgroundColor: "#f9f9f9" }} // Background color for cards
            >
              <h2 className="font-bold text-lg flex items-center">
                <FaShoppingCart className="mr-2 text-green-500" /> Order #
                {order.id}
              </h2>
              <p className="mt-2">
                <strong>Restaurant:</strong>{" "}
                {order.restaurant?.name || "Unknown Restaurant"}
              </p>
              <p>
                <span
                  className={`font-semibold ${
                    order.status === "Delivered"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  Status: {order.status}
                </span>
              </p>
              <p>
                <strong>Total Price:</strong> ${order.total_price}
              </p>
              <p>
                <strong>Ordered At:</strong>{" "}
                {new Date(order.created_at).toLocaleDateString()}
              </p>
              <div className="mt-4">
                <h3 className="font-bold">Order Items:</h3>
                <ul className="list-disc list-inside">
                  {order.order_items.map((item) => (
                    <li key={item.id}>
                      {/* Ensure menu_item has necessary details */}
                      {item.menu_item?.name || "Unknown Item"} (x{item.quantity}
                      )
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>You have no orders yet.</p>
      )}
    </div>
  );
}

export default UserOrders;
