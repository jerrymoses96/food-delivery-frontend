"use client";
import { useCart } from "@/context/cartContext"; // Import the cart context
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"; // To get the auth token
import {
  FaTrash,
  FaShoppingCart,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa"; // Importing icons

const CartPage = () => {
  const { cartItems, updateCartItemQuantity, removeFromCart, clearCart } =
    useCart(); // Access cart context
  const router = useRouter();

  // Calculate total price
  const calculateTotal = (items) => {
    return items
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  // Handle quantity change
  const handleQuantityChange = (itemId, quantity) => {
    if (quantity < 1) {
      return; // Prevent quantity from going below 1
    }
    updateCartItemQuantity(itemId, quantity);
  };

  // Handle removing item from cart
  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId);
  };

  // Handle placing the order
  const handlePlaceOrder = async () => {
    const token = Cookies.get("access_token"); // Get the token

    // Group items by restaurant
    const ordersByRestaurant = cartItems.reduce((acc, item) => {
      const restaurant = item.restaurant; // Using the restaurant field from your data
      if (!acc[restaurant]) {
        acc[restaurant] = [];
      }
      acc[restaurant].push(item);
      return acc;
    }, {});

    // Place orders for each restaurant
    for (const [restaurant, items] of Object.entries(ordersByRestaurant)) {
      const orderData = {
        restaurant: Number(restaurant), // Ensure this is a number
        total_price: calculateTotal(items), // Total for this restaurant
        order_items: items.map((item) => ({
          menu_item: item.id, // Send only the ID of the menu item
          quantity: item.quantity,
        })),
      };

      try {
        const response = await fetch("http://127.0.0.1:8000/api/orders/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orderData),
        });

        if (!response.ok) {
          console.error(
            "Failed to place the order for restaurant:",
            restaurant
          );
        } else {
          const responseData = await response.json();
          console.log("Order placed successfully:", responseData);
        }
      } catch (error) {
        console.error("Error placing order for restaurant:", restaurant, error);
      }
    }
    clearCart(); // Clear the cart
    router.push("/user-orders"); // Redirect to orders page
  };

  return (
    <div className=" mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4 flex items-center">
        <FaShoppingCart className="mr-2 text-green-500" /> Your Cart
      </h1>
      {cartItems.length > 0 ? (
        <div className="h-dvh">
          <ul className="space-y-4 ">
            {cartItems.map((item) => (
              <li
                key={item.id}
                className="border rounded-lg p-4 flex justify-between items-center shadow-md hover:shadow-lg transition duration-200 bg-white"
              >
                <div className="flex items-center">
                  <img
                    src={item.image} // Assume item has an image URL
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md mr-4"
                  />
                  <div>
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <p className="text-gray-700">
                      Price: $
                      {isNaN(item.price)
                        ? "N/A"
                        : Number(item.price).toFixed(2)}
                    </p>
                    <div className="flex items-center mt-2">
                      <label htmlFor={`quantity-${item.id}`} className="mr-2">
                        Quantity:
                      </label>
                      <input
                        id={`quantity-${item.id}`}
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            item.id,
                            parseInt(e.target.value)
                          )
                        }
                        className="w-16 p-1 border rounded-md"
                      />
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveFromCart(item.id)}
                  className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition duration-200 flex items-center"
                >
                  <FaTrash className="mr-1" /> Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-6 border-t pt-4">
            <h2 className="text-2xl font-bold flex items-center">
              Total: ${calculateTotal(cartItems)}{" "}
              <FaCheckCircle className="ml-2 text-green-600" />
            </h2>
            <button
              onClick={handlePlaceOrder} // Place order
              className="mt-4 bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition duration-200 flex items-center"
            >
              <FaShoppingCart className="mr-2" /> Place Order
            </button>
          </div>
        </div>
      ) : (
        <div className=" w-full text-gray-500">
          <div className="flex text-2xl font-bold items-center justify-center h-dvh">
            Your cart is empty.
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
