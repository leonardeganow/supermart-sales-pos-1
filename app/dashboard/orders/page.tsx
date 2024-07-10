import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
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

function Page() {
  return (
    <div>
      <div className="grid sm:grid-cols-12 gap-4">
        <div className="col-span-9">
          <div>
            <h1 className="font-semibold text-2xl">Orders</h1>
            <p className="text-sm">
              Experience a seamless purchasing experience
            </p>
          </div>
          <div className="sm:flex sm:flex-row  flex flex-col justify-between gap-y-2 sm:items-center mt-8">
            <h1 className="font-semibold">List products</h1>
            <div className="sm:flex sm:flex-row flex flex-col gap-y-2 gap-x-2">
              <Button variant="outline" className=" gap-x-2">
                {" "}
                <CiBarcode size={30} />
                Scan Barcode
              </Button>
              <Input placeholder="search product" />
            </div>
          </div>
          <hr className="my-8" />

          <div className="sm:px-12 mb-8">
            <Carousel className="w-[250px] sm:w-full  mx-auto sm:mx-0">
              <CarouselContent>
                <CarouselItem className="basis-1/8 ">
                  <Button variant="outline"> All Products</Button>
                </CarouselItem>
                <CarouselItem className="basis-1/8 ">
                  <Button variant="outline"> All Products</Button>
                </CarouselItem>
                <CarouselItem className="basis-1/8 ">
                  <Button variant="outline"> All Products</Button>
                </CarouselItem>
                <CarouselItem className="basis-1/8 ">
                  <Button variant="outline"> All Products</Button>
                </CarouselItem>
                <CarouselItem className="basis-1/8 ">
                  <Button variant="outline"> All Products</Button>
                </CarouselItem>
                <CarouselItem className="basis-1/8 ">
                  <Button variant="outline"> All Products</Button>
                </CarouselItem>
                <CarouselItem className="basis-1/8 ">
                  <Button variant="outline"> All Products</Button>
                </CarouselItem>
                <CarouselItem className="basis-1/8 ">
                  <Button variant="outline"> All Products</Button>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          <div className="grid sm:grid-cols-4">
            <Card className="flex p-2 gap-x-4">
              <div>
                <Image
                  src="https://res.cloudinary.com/dmywtk0vi/image/upload/v1720552470/feedback-user-photos/rqjwypuetemaypwj2wyc.jpg"
                  className=""
                  width={50}
                  height={30}
                  alt=""
                />
              </div>
              <div className="flex justify-between  w-full">
                <div>
                  <CardTitle>Milo 500g</CardTitle>
                  <CardDescription>29.99</CardDescription>
                </div>
                <Button variant="outline" size="icon">
                  <TbGardenCart className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
        <div className=" col-span-3 hidden sm:block  border-l border-gray-300 dark:border-gray-700 p-4">
          sidebar right
        </div>
      </div>
    </div>
  );
}

export default Page;
