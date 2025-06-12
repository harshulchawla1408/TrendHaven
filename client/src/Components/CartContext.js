import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [itemCount, setItemCount] = useState(0);

  const updateItemCount = useCallback((items) => {
    const count = items.reduce(
      (total, item) => total + (item.quantity || 1),
      0
    );
    setItemCount(count);
  }, []);

  const totalAmount = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price) || 0;
      const qty = parseInt(item.quantity) || 1;
      return total + price * qty;
    }, 0);
  }, [cartItems]);

  const syncCartToLocalStorage = (items) => {
    try {
      localStorage.setItem("cart", JSON.stringify(items));
    } catch (err) {
      console.error("Failed to sync cart:", err);
    }
  };

  const loadCartFromLocalStorage = useCallback(() => {
  try {
    const savedCart = localStorage.getItem("cart");
    const user = JSON.parse(localStorage.getItem("user")); // 👈 Check for user

    if (!user) {
      // If not logged in, don't load cart (or clear it optionally)
      localStorage.removeItem("cart");
      return;
    }

    if (savedCart) {
      const parsed = JSON.parse(savedCart);
      if (Array.isArray(parsed)) {
        setCartItems(parsed);
        updateItemCount(parsed);
      } else {
        console.warn("Invalid cart structure in localStorage");
        localStorage.removeItem("cart");
      }
    }
  } catch (err) {
    console.error("Error loading cart from localStorage:", err);
  }
}, [updateItemCount]);


  // ✅ Load cart on first render
  useEffect(() => {
    loadCartFromLocalStorage();
  }, [loadCartFromLocalStorage]);

  // ✅ Sync across tabs
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "cart") {
        loadCartFromLocalStorage();
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, [loadCartFromLocalStorage]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    setItemCount(0);
    localStorage.removeItem("cart");
  }, []);

  const addToCart = (product) => {
    if (!product || !product._id) return;

    setCartItems((prevItems) => {
      const existing = prevItems.find((i) => i._id === product._id);
      let updated;

      if (existing) {
        updated = prevItems.map((item) =>
          item._id === product._id
            ? {
                ...item,
                quantity:
                  (parseInt(item.quantity) || 1) +
                  (parseInt(product.quantity) || 1),
              }
            : item
        );
      } else {
        updated = [...prevItems, { ...product, quantity: parseInt(product.quantity) || 1 }];
      }

      syncCartToLocalStorage(updated);
      updateItemCount(updated);
      return updated;
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item._id === productId);
      let updated;

      if (existing && existing.quantity > 1) {
        updated = prevItems.map((item) =>
          item._id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        updated = prevItems.filter((item) => item._id !== productId);
      }

      syncCartToLocalStorage(updated);
      updateItemCount(updated);
      return updated;
    });
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        itemCount,
        totalAmount,
        addToCart,
        removeFromCart,
        clearCartItems: clearCart,
        clearCart,
        updateItemCount,
        cartTotal: totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
};

export default CartContext;
