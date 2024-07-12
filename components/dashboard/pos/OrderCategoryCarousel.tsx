import { supermarketCategories } from "@/app/dashboard/products/ProductForm";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import React from "react";

function OrderCategoryCarousel(props: any) {
  return (
    <Carousel className="w-[250px] sm:w-full mx-auto sm:mx-0">
      <CarouselContent>
        {supermarketCategories.map((category) => {
          return (
            <CarouselItem key={category} className="basis-1/8">
              <Button
                onClick={() => {
                  props.setKeyword(category);
                  props.refetch();
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
  );
}

export default OrderCategoryCarousel;
