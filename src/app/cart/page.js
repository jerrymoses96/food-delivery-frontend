"use client";

import { useCart } from "@/context/cartContext"; // Import the cart context
import { useRouter } from "next/navigation";

const CartPage = () => {
  const { cartItems, updateCartItemQuantity, removeFromCart } = useCart(); // Access cart context
  const router = useRouter();
  console.log(cartItems);

  // Calculate total price
  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  // Handle quantity change
  const handleQuantityChange = (itemId, quantity) => {
    if (quantity < 1) {
      // Prevent quantity from going below 1
      return;
    }
    updateCartItemQuantity(itemId, quantity);
  };

  // Handle removing item from cart
  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId);
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">Your Cart</h1>
      {cartItems.length > 0 ? (
        <div>
          <ul className="space-y-4">
            {cartItems.map((item) => (
              <li
                key={item.id}
                className="border rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-gray-700">
                    Price: ${item.price.toFixed(2)}
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
                        handleQuantityChange(item.id, parseInt(e.target.value))
                      }
                      className="w-16 p-1 border rounded-md"
                    />
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveFromCart(item.id)}
                  className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition duration-200"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <h2 className="text-2xl font-bold">Total: ${calculateTotal()}</h2>
            <button
              onClick={() => router.push("/checkout")} // Redirect to checkout page
              className="mt-4 bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition duration-200"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default CartPage;
