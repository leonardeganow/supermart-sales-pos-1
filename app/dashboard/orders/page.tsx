"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
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

function Page() {
  const [keyword, setKeyword] = useState<string>("");

  console.log(keyword);

  const searchProducts = async () => {
    const data = {
      keyword: keyword,
    };
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

  const renderProducts = () => {
    if (isFetching) {
      return <div>Loading...</div>;
    }

    if (isError) {
      return <div>Error fetching products: {error.message}</div>;
    }

    if (data) {
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
              <CardDescription>{product.sellingPrice}</CardDescription>
            </div>
            <Button variant="outline" size="icon">
              <TbGardenCart className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ));
    }

    return <div>No products found</div>;
  };

  return (
    <div className="">
      <div className="grid sm:grid-cols-12 gap-4 h-[85dvh]">
        <div className="col-span-9">
          <div>
            <h1 className="font-semibold text-2xl">Orders</h1>
            <p className="text-sm">
              Experience a seamless purchasing experience
            </p>
          </div>
          <div className="sm:flex sm:flex-row flex flex-col justify-between gap-y-2 sm:items-center mt-8">
            <h1 className="font-semibold">List products</h1>
            <div className="sm:flex sm:flex-row flex flex-col gap-y-2 gap-x-2">
              <Button variant="outline" className="gap-x-2">
                <CiBarcode size={30} />
                Scan Barcode
              </Button>
              <Input
                placeholder="Search product"
                value={keyword}
                onInput={(e) => {
                  setKeyword(e.currentTarget.value);
                  refetch();
                }}
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

          <div className="grid sm:grid-cols-4 gap-4">{renderProducts()}</div>
        </div>
        <div className="col-span-3 hidden sm:block border-l border-gray-300 dark:border-gray-700 p-4">
          Sidebar right
        </div>
      </div>
    </div>
  );
}

export default Page;
