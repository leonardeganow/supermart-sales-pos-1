"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect, useRef } from "react";
import { CiBarcode } from "react-icons/ci";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

import Image from "next/image";
import { TbGardenCart } from "react-icons/tb";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

import CheckoutPanel from "@/components/dashboard/pos/CheckoutPanel";
import OrderCategoryCarousel from "@/components/dashboard/pos/OrderCategoryCarousel";
import { addToCart } from "@/app/helpers";
import { toast } from "sonner";
import { useReactToPrint } from "react-to-print";
import Receipt from "@/components/receipt/Receipt";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

function Page() {
  const [keyword, setKeyword] = useState("");
  const [paymentId, setPaymentId] = useState<string>("");
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState<number>(0);
  const [totalBeforeDiscount, setTotalBeforeDiscount] = useState<number>(0);
  const [taxRate, setTaxRate] = useState<number>(0);
  const [totalDiscount, setTotalDiscount] = useState<number>(0);
  const [finalTotal, setFinalTotal] = useState<number>(0);
  const [taxPayable, setTaxPayable] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const [loader, setLoader] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [printModal, setPrintModal] = useState<boolean>(false);
  const [receiptData, setReceiptData] = useState<any>({});

  const componentRef: any = useRef();

  //this function prints order receipt
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  //this function searches for products and returns response
  const searchProducts = async () => {
    const data = { keyword: keyword };
    try {
      const response = await axios.post("/api/searchproducts", data);
      if (response.data.status) {
        return response.data.products;
      } else {
        // console.log(response);
        return response.data.message;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const { isFetching, isError, error, data, refetch } = useQuery({
    queryKey: ["searchproducts", keyword],
    queryFn: searchProducts,
    staleTime: 5000,
  });

  //this function handles the keyword change
  const handleKeywordChange = (value: string) => {
    setKeyword(value);
    refetch();
  };

  //function to render the search
  const renderProducts = () => {
    if (isFetching) {
      return [...Array(4)].map((_, index) => (
        <Skeleton key={index} className="h-20 w-full" />
      ));
    }

    if (isError) {
      return <div>Error fetching products: {error.message}</div>;
    }

    if (Array.isArray(data) && data.length > 0) {
      return data.map((product: any) => (
        <Card key={product._id} className="flex p-2 gap-x-4">
          <div>
            <Image
              src={product.image}
              className=""
              width={50}
              height={30}
              alt=""
            />
          </div>
          <div className="flex justify-between w-full">
            <div>
              <CardTitle>{product.name}</CardTitle>
              <CardDescription>
                {product.currency === "GHS" ? "₵" : "$"}
                {product.sellingPrice}
              </CardDescription>
            </div>
            <Button
              onClick={() => addToCart(product, setCart)}
              variant="outline"
              size="icon"
            >
              <TbGardenCart className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ));
    }

    if (typeof data === "string") {
      return (
        <h1 className="text-center w-full col-span-4">search for a product </h1>
      );
    }

    return <h1>No products found</h1>;
  };

  // Updated calculateTotal function
  const calculateTotal = () => {
    const totalAmount = cart.reduce(
      (acc, item: any) => acc + item.totalPrice,
      0
    );
    const totalOriginalPrice = cart.reduce(
      (acc, item: any) => acc + item.quantity * item.sellingPrice,
      0
    );
    const totalDiscountAmount = totalOriginalPrice - totalAmount;
    const taxPayable = totalAmount * taxRate;
    const finalAmount = totalAmount + taxPayable;

    setTaxPayable(taxPayable);
    setTotal(totalAmount);
    setTotalBeforeDiscount(totalOriginalPrice);
    setTotalDiscount(totalDiscountAmount);
    setFinalTotal(finalAmount);
  };

  //make payment function
  const makePayment = async () => {
    // Iterate through the cart array and create a new array with modified objects
    const modifiedCart = cart.map((item: any) => ({
      productId: item._id,
      quantity: item.quantity,
      currency: item.currency,
      total: item.totalPrice,
    }));

    const data = {
      customerName: "guest",
      paymentMethod: paymentMethod,
      taxAmount: taxPayable,
      cart: modifiedCart,
      totalDiscount,
      finalTotal: finalTotal,
      paymentId: paymentId,
    };

    try {
      setLoader(true);
      const response = await axios.post("/api/createorder", data);
      setReceiptData((prev: any) => {
        return {
          ...prev,
          orderId: response.data.order._id,
          orderTime: response.data.order.orderDate,
          paymentMethod: response.data.order.paymentMethod,
          supermarketName: response.data.supermarketName,
          supermarketLocation: response.data.supermarketLocation,
          supermarketNumber: response.data.supermarketNumber,
          cashierName: response.data.cashierName,
        };
      });

      if (response.data.status) {
        setPrintModal(true);
        setLoader(false);
        setOpenModal(false);
        toast.success(response.data.message);
        // Clear the cart
      } else {
        setLoader(false);
        setOpenModal(false);
        toast.error(response.data.message);
      }
    } catch (error) {
      setLoader(false);
      setOpenModal(false);
      console.error(error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  useEffect(() => {
    calculateTotal();
  }, [cart, taxRate]);

  return (
    <div className="">
      <div className="grid sm:grid-cols-12 gap-4 h-[85dvh]">
        <div className="lg:col-span-9 md:col-span-6">
          <div>
            <h1 className="font-semibold text-2xl">Orders</h1>
            <p className="text-sm">
              Experience a seamless purchasing experience
            </p>
          </div>
          <div className="sm:flex sm:flex-row flex flex-col justify-between gap-y-2 sm:items-center mt-8">
            <h1 className="font-semibold">List products</h1>
            <div className="sm:flex lg:flex-row flex flex-col gap-y-2 gap-x-2">
              <Button variant="outline" className="gap-x-2">
                <CiBarcode size={30} />
                Scan Barcode
              </Button>
              <Input
                placeholder="Search product"
                value={keyword}
                onInput={(e) => handleKeywordChange(e.currentTarget.value)}
              />
            </div>
          </div>

          <hr className="my-8" />

          <div className="sm:px-12 mb-8">
            <OrderCategoryCarousel setKeyword={setKeyword} refetch={refetch} />
          </div>

          <div className="grid lg:grid-cols-3 gap-4">{renderProducts()}</div>
        </div>
        <CheckoutPanel
          cart={cart}
          totalDiscount={totalDiscount}
          loader={loader}
          finalTotal={finalTotal}
          taxPayable={taxPayable}
          totalBeforeDiscount={totalBeforeDiscount}
          setCart={setCart}
          setTaxRate={setTaxRate}
          makePayment={makePayment}
          setPaymentMethod={setPaymentMethod}
          paymentMethod={paymentMethod}
          setPaymentId={setPaymentId}
          paymentId={paymentId}
          openModal={openModal}
          setOpenModal={setOpenModal}
        />

        <AlertDialog open={printModal} onOpenChange={setPrintModal}>
          <AlertDialogContent>
            <Receipt
              receiptData={receiptData}
              cart={cart}
              componentRef={componentRef}
              totalBeforeDiscount={totalBeforeDiscount}
              totalDiscount={totalDiscount}
              taxPayable={taxPayable}
              finalTotal={finalTotal}
            />
            <AlertDialogFooter>
              <Button onClick={handlePrint}>click to print</Button>
              <Button
                variant="outline"
                onClick={() => {
                  setPrintModal(false);
                  setCart([]);
                  // Reset the totals
                  setTotal(0);
                  setTotalBeforeDiscount(0);
                  setTaxRate(0);
                  setTotalDiscount(0);
                  setPaymentId("");
                  setFinalTotal(0);
                  setTaxPayable(0);
                  setPaymentMethod("cash");
                }}
              >
                close order
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

export default Page;
