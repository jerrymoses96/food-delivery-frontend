"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

function UserOrders() {
  const [orders, setOrders] = useState([]);
  const token = Cookies.get("access_token");

  useEffect(() => {
    // Fetch the user's orders from the API
    fetch("http://127.0.0.1:8000/api/orders/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Assuming you're using a token
      },
    })
      .then((response) => response.json())
      .then((data) => setOrders(data))
      .catch((error) => console.error("Error fetching orders:", error));
  }, []);
  console.log(orders);
  

  return (
    <div className="container mx-auto my-4">
      <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
      {orders.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {orders.map((order) => (
            <div key={order.id} className="border p-4 rounded shadow">
              <h2 className="font-bold">Order #{order.id}</h2>
              <p>
                <strong>Restaurant:</strong> {order.restaurant.name}
              </p>
              <p>
                <strong>Status:</strong> {order.status}
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
                <ul>
                  {order.order_items.map((item) => (
                    <li key={item.id}>
                      {item.menu_item.name} (x{item.quantity})
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
