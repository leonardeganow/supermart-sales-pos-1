//@ts-nocheck
import imglyRemoveBackground from "@imgly/background-removal";

//NOTE - gets the initials of full name. name should be a string
export default function getInitials(name: string) {
  if (name === undefined || null) {
    return;
  }
  // Split the name into an array of words
  const words = name.split(" ");

  // Get the first letter of each word and capitalize it
  const initials = words.map((word) => word.charAt(0).toUpperCase());

  // Join the initials into a single string
  return initials.join("");
}

//NOTE - function to add products to cart
export const addToCart = (product: any, setterstate: () => void) => {
  setterstate((prev): any => {
    const existingProduct = prev.find((item: any) => item._id === product._id);
    if (existingProduct) {
      return prev.map((item: any) =>
        item._id === product._id
          ? {
              ...item,
              quantity: item.quantity + 1,
              totalPrice: (item.quantity + 1) * item.sellingPrice,
            }
          : item
      );
    }
    return [
      ...prev,
      { ...product, quantity: 1, totalPrice: product.sellingPrice },
    ];
  });
};

//NOTE - increase item quantity
export const increaseQuantity = (id: string, setterstate: () => void) => {
  setterstate((prev) =>
    prev.map((item) =>
      item._id === id
        ? {
            ...item,
            quantity: item.quantity + 1,
            totalPrice:
              (item.quantity + 1) *
              (item.sellingPrice -
                (item.sellingPrice * (item.discount || 0)) / 100),
          }
        : item
    )
  );
};

//NOTE - decrease item quantity
export const decreaseQuantity = (id: string, setterstate: () => void) => {
  setterstate((prev) =>
    prev.map((item) =>
      item._id === id
        ? {
            ...item,
            quantity: Math.max(1, item.quantity - 1),
            totalPrice:
              Math.max(1, item.quantity - 1) *
              (item.sellingPrice -
                (item.sellingPrice * (item.discount || 0)) / 100),
          }
        : item
    )
  );
};

//NOTE - function to set discount
export const setDiscount = (
  id: string,
  discount: number,
  setterstate: () => void
) => {
  setterstate((prev) =>
    prev.map((item) => {
      const validDiscount = isNaN(discount) || discount < 0 ? 0 : discount;
      return item._id === id
        ? {
            ...item,
            discount: validDiscount,
            totalPrice:
              item.quantity *
              (item.sellingPrice - (item.sellingPrice * validDiscount) / 100),
          }
        : item;
    })
  );
};

//NOTE - clear cart
export const removeFromCart = (id: string, setterstate: () => void) => {
  setterstate((prev) => prev.filter((item) => item._id !== id));
};
