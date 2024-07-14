import {
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
  setDiscount,
} from "@/app/helpers";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Loader2, Minus, Plus } from "lucide-react";
import Image from "next/image";
import React from "react";
import { AiOutlineDelete } from "react-icons/ai";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import Receipt from "@/components/receipt/Receipt";

interface CheckoutPanelProps {
  cart: any;
  loader: boolean;
  openModal: boolean;
  setCart: any;
  totalDiscount: number;
  finalTotal: number;
  taxPayable: number;
  setPaymentId: any;
  setOpenModal: any;
  paymentMethod: string;
  paymentId: string;
  totalBeforeDiscount: number;
  setTaxRate: any;
  makePayment: () => void;
  setPaymentMethod: (param: string) => void;
}
function CheckoutPanel(props: CheckoutPanelProps) {
  const paymentMethods = [
    {
      id: 1,
      value: "cash",
    },
    {
      id: 2,
      value: "mobile money",
    },
    {
      id: 3,
      value: "credit card",
    },
  ];
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

      <div className="flex flex-col gap-y-8 mt-4 h-[45dvh] overflow-y-scroll">
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
                      onClick={() => removeFromCart(product._id, props.setCart)}
                      className="w-8 h-7 absolute right-0 top-0 text-red-500"
                      variant="outline"
                      size="icon"
                    >
                      <AiOutlineDelete className="h-4 w-4 " />
                    </Button>
                  </div>
                  <p className="font-semibold">
                    {product.currency === "GHS" ? "₵" : "$"}
                    {product.totalPrice.toFixed(2)}
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
            props.setTaxRate((prev: any) => {
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
      <div className="flex flex-col gap-2  bg-muted  p-2 rounded-lg font-semibold mb-2">
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
            <p className="">
              +{props.taxPayable.toFixed(2)}{" "}
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
      <ToggleGroup variant="outline" type="single" className="my-4">
        {paymentMethods.map((paymentMethod) => {
          return (
            <div
              onClick={() => props.setPaymentMethod(paymentMethod.value)}
              key={paymentMethod.id}
              aria-label="Toggle payment method"
              className={`${
                paymentMethod.value === props.paymentMethod
                  ? "bg-green-500 text-white border-0 "
                  : "border p-2 rounded"
              } border p-2 rounded cursor-pointer hover:bg-green-500 hover:text-white`}
            >
              {paymentMethod.value === "mobile money"
                ? "momo"
                : paymentMethod.value}
            </div>
          );
        })}
      </ToggleGroup>
      {props.paymentMethod !== "cash" && (
        <div className="mb-4">
          <Input
            id={`paymentId`}
            type="text"
            placeholder="enter payment id"
            className=""
            value={props.paymentId}
            onChange={(e) => {
              props.setPaymentId(e.target.value);
            }}
          />
        </div>
      )}

      <AlertDialog open={props.openModal} onOpenChange={props.setOpenModal}>
        <Button
          onClick={() => {
            if (props.cart.length <= 0) {
              toast.info("Cart is empty. Please add products to proceed.");
              return;
            }
            if (props.paymentMethod !== "cash" && !props.paymentId) {
              toast.info("please enter a payment Id");
              return;
            }
            props.setOpenModal(true);
          }}
          className="w-full"
        >
          Pay
        </Button>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to confirm payment?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No</AlertDialogCancel>
            <Button
              disabled={props.loader}
              onClick={props.makePayment}
              className=""
            >
              {props.loader ? (
                <div className="flex justify-center items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </div>
              ) : (
                "Yes"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default CheckoutPanel;
