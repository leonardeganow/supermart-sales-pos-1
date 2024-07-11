"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect } from "react";
import { CiBarcode } from "react-icons/ci";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { TbGardenCart } from "react-icons/tb";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { supermarketCategories } from "../products/ProductForm";
import { Skeleton } from "@/components/ui/skeleton";
import { Delete, DeleteIcon, LucideDelete, Minus, Plus } from "lucide-react";
import { XCircle } from "lucide-react";
import { AiOutlineDelete } from "react-icons/ai";
import { ScrollArea } from "@/components/ui/scroll-area";

function Page() {
  const [keyword, setKeyword] = useState<string>("");
  const [cart, setCart] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [totalBeforeDiscount, setTotalBeforeDiscount] = useState<number>(0);

  const [totalDiscount, setTotalDiscount] = useState<number>(0);

  const searchProducts = async () => {
    const data = { keyword: keyword };
    try {
      const response = await axios.post("/api/searchproducts", data);
      if (response.data.status) {
        return response.data.products;
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

  const handleKeywordChange = (value: string) => {
    setKeyword(value);
    refetch();
  };

  const renderProducts = () => {
    if (isFetching) {
      return [...Array(4)].map((_, index) => (
        <Skeleton key={index} className="h-20 w-full" />
      ));
    }

    if (isError) {
      return <div>Error fetching products: {error.message}</div>;
    }

    if (data && data.length > 0) {
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
              onClick={() => addToCart(product)}
              variant="outline"
              size="icon"
            >
              <TbGardenCart className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ));
    }

    return <h1>No products found</h1>;
  };

  const addToCart = (product: any) => {
    setCart((prev): any => {
      const existingProduct = prev.find(
        (item: any) => item._id === product._id
      );
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

  const increaseQuantity = (id: string) => {
    setCart((prev) =>
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

  const decreaseQuantity = (id: string) => {
    setCart((prev) =>
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

  const setDiscount = (id: string, discount: number) => {
    setCart((prev) =>
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
  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const calculateTotal = () => {
    const totalAmount = cart.reduce((acc, item) => acc + item.totalPrice, 0);
    const totalOriginalPrice = cart.reduce(
      (acc, item) => acc + item.quantity * item.sellingPrice,
      0
    );
    const totalDiscountAmount = totalOriginalPrice - totalAmount;
    setTotal(totalAmount);
    setTotalBeforeDiscount(totalOriginalPrice);
    setTotalDiscount(totalDiscountAmount);
  };

  useEffect(() => {
    calculateTotal();
  }, [cart]);

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
            <Carousel className="w-[250px] sm:w-full mx-auto sm:mx-0">
              <CarouselContent>
                {supermarketCategories.map((category) => {
                  return (
                    <CarouselItem key={category} className="basis-1/8">
                      <Button
                        onClick={() => {
                          setKeyword(category);
                          refetch();
                        }}
                        variant="outline"
                      >
                        {category}
                      </Button>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          <div className="grid lg:grid-cols-3 gap-4">{renderProducts()}</div>
        </div>
        <div className="lg:col-span-3 md:col-span-6  sm:block sm:border-l border-gray-300 dark:border-gray-700 p-4">
          <h1 className="font-semibold">Order checkout</h1>
          <hr className="my-4" />
          <div className="flex justify-between items-center">
            <p>{cart.length} items Selected</p>
            <Button
              onClick={() => setCart([])}
              variant="ghost"
              className="text-red-500"
            >
              Clear all
            </Button>
          </div>

          <div className="flex flex-col gap-y-8 mt-4 h-[50dvh] overflow-y-scroll">
            {cart.map((product: any) => (
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
                      <label htmlFor={`discount-${product._id}`}>
                        Discount:
                      </label>
                      <Input
                        id={`discount-${product._id}`}
                        type="number"
                        className="w-16"
                        value={product.discount || ""}
                        onChange={(e) =>
                          setDiscount(product._id, parseFloat(e.target.value))
                        }
                      />
                    </div>

                    <div className="flex justify-between pt-4">
                      <div className="flex items-center gap-2">
                        <Button
                          className="w-8 h-7"
                          variant="outline"
                          size="icon"
                          onClick={() => increaseQuantity(product._id)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <p>{product.quantity}</p>
                        <Button
                          onClick={() => decreaseQuantity(product._id)}
                          className="w-8 h-7"
                          variant="outline"
                          size="icon"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => removeFromCart(product._id)}
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
          <div className="flex flex-col gap-3  bg-muted  p-2 rounded-lg font-semibold mb-2">
            <div className="flex justify-between">
              <p className="font-semibold">Sub Total</p>
              <p>
                {totalBeforeDiscount.toFixed(2)}{" "}
                {cart.length > 0 && cart[0].currency}
              </p>
            </div>

            <div className="flex justify-between items-center">
              <p className="font-semibold">Total Discount</p>
              <p className="text-red-500">
                -{totalDiscount.toFixed(2)}{" "}
                {cart.length > 0 && cart[0].currency}
              </p>
            </div>
            <hr />
            <div className="flex justify-between items-center">
              <p className="font-semibold">You Pay</p>
              <p className="text-green-700 font-semibold">
                {total.toFixed(2)} {cart.length > 0 && cart[0].currency}
              </p>
            </div>
          </div>
          <Button className="w-full">Pay</Button>
        </div>
      </div>
    </div>
  );
}

export default Page;
