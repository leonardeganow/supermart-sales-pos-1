import { decreaseQuantity, increaseQuantity, removeFromCart, setDiscount } from "@/app/helpers";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import React from "react";
import { AiOutlineDelete } from "react-icons/ai";

function CheckoutPanel(props: any) {
  return (
    <div className="lg:col-span-3 md:col-span-6  sm:block sm:border-l border-gray-300 dark:border-gray-700 p-4">
      <h1 className="font-semibold">Order checkout</h1>
      <hr className="my-4" />
      <div className="flex justify-between items-center">
        <p>{props.cart.length} items Selected</p>
        <Button
          onClick={() => props.setCart([])}
          variant="ghost"
          className="text-red-500"
        >
          Clear all
        </Button>
      </div>

      <div className="flex flex-col gap-y-8 mt-4 h-[50dvh] overflow-y-scroll">
        {props.cart.map((product: any) => (
          <div key={product._id} className="relative">
            <div className="flex gap-2">
              <div>
                <Image
                  src={product.image}
                  className=""
                  width={120}
                  height={100}
                  alt=""
                />
              </div>
              <div className="flex-1 ">
                <p className="font-semibold">{product.name}</p>
                <p className="">{product.category}</p>
                <div className="flex justify-between pt-4 items-center">
                  <label htmlFor={`discount-${product._id}`}>Discount:</label>
                  <Input
                    id={`discount-${product._id}`}
                    type="number"
                    className="w-16"
                    value={product.discount || ""}
                    onChange={(e) =>
                      setDiscount(
                        product._id,
                        parseFloat(e.target.value),
                        props.setCart
                      )
                    }
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <div className="flex items-center gap-2">
                    <Button
                      className="w-8 h-7"
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        increaseQuantity(product._id, props.setCart)
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <p>{product.quantity}</p>
                    <Button
                      onClick={() =>
                        decreaseQuantity(product._id, props.setCart)
                      }
                      className="w-8 h-7"
                      variant="outline"
                      size="icon"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => removeFromCart(product._id,props.setCart)}
                      className="w-8 h-7 absolute right-0 top-0 text-red-500"
                      variant="outline"
                      size="icon"
                    >
                      <AiOutlineDelete className="h-4 w-4 " />
                    </Button>
                  </div>
                  <p className="font-semibold">
                    {product.currency === "GHS" ? "₵" : "$"}
                    {product.totalPrice}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <hr className="my-4" />
      <div className="flex items-center space-x-2 pb-2">
        <Checkbox
          onClick={() =>
            props.setTaxRate((prev: number) => {
              return prev === 0.175 ? 0 : 0.175;
            })
          }
          id="terms"
        />
        <label
          htmlFor="terms"
          className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Add composite tax (17.5%)
        </label>
      </div>
      <div className="flex flex-col gap-3  bg-muted  p-2 rounded-lg font-semibold mb-2">
        <div className="flex justify-between">
          <p className="font-semibold">Sub Total</p>
          <p>
            {props.totalBeforeDiscount.toFixed(2)}{" "}
            {props.cart.length > 0 && props.cart[0].currency}
          </p>
        </div>

        <div className="flex justify-between items-center">
          <p className="font-semibold">Discount</p>
          <p className="text-red-500">
            -{props.totalDiscount.toFixed(2)}{" "}
            {props.cart.length > 0 && props.cart[0].currency}
          </p>
        </div>
        {props.taxPayable !== 0 && (
          <div className="flex justify-between items-center">
            <p className="font-semibold">Tax</p>
            <p className="text-red-500">
              -{props.taxPayable.toFixed(2)}{" "}
              {props.cart.length > 0 && props.cart[0].currency}
            </p>
          </div>
        )}
        <hr />
        <div className="flex justify-between items-center">
          <p className="font-semibold">You Pay</p>
          <p className=" font-semibold">
            {props.finalTotal.toFixed(2)}{" "}
            {props.cart.length > 0 && props.cart[0].currency}
          </p>
        </div>
      </div>
      <Button className="w-full">Pay</Button>
    </div>
  );
}

export default CheckoutPanel;