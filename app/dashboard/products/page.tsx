"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";
import { DataTable } from "./DataTable";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import ProductForm from "./ProductForm";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
function Page() {
  const [type, setType] = React.useState("");
  const [userData, setUserData] = React.useState();
  const [showModal, setShowModal] = React.useState(false);

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="block">{row.original.name}</div>;
      },
    },

    {
      accessorKey: "quantity",

      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Quantity
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="block">{row.original.quantity}</div>;
      },
    },
    {
      accessorKey: "inStock",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            In stock
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const inStock = row.original.inStock ? (
          <div className="bg-green-500 rounded-lg "> in stock</div>
        ) : (
          <div className="bg-red-500  rounded-lg ">out of stock</div>
        );

        return (
          <Badge variant={row.original.inStock ? "secondary" : "destructive"}>
            {row.original.inStock ? "In Stock" : "Out of Stock"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "category",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Category
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="block">{row.original.category}</div>;
      },
    },
    {
      accessorKey: "basePrice",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Base price
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="block">{row.original.basePrice}</div>;
      },
    },
    {
      accessorKey: "sellingPrice",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Selling price
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="block">{row.original.sellingPrice}</div>;
      },
    },
    {
      accessorKey: "image",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Image
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <Image
            className="rounded-lg"
            src={row.original.image}
            width={30}
            height={30}
            alt={row.original.name}
          />
        );
      },
    },
    {
      accessorKey: "barcode",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Barcode
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="block">{row.original.barcode}</div>;
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      id: "actions",
      cell: ({ row }: any) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  setUserData(row.original);
                  setType("edit");
                  setShowModal(true);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setUserData(row.original._id);
                  setType("delete");
                  setShowModal(true);
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const getProducts = async () => {
    try {
      const response = await axios.get("/api/getproducts");
      if (response.data.status) {
        return response.data.products;
      }
    } catch (error) {
      console.error(error);
    }
  };
  const { isFetching, isError, error, data, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    staleTime: 5000,
  });

  return (
    <div className="">
      <div className="flex-col flex sm:flex-row gap-y-4 justify-between sm:items-center">
        <div>
          <h1 className="font-semibold">Product management</h1>
          <p className="text-sm">View, edit, and delete your products</p>
        </div>

        <div className="sm:flex-row sm:items-center gap-x-2  gap-y-4">
          <Dialog open={showModal} onOpenChange={setShowModal}>
            <Button
              onClick={() => {
                setType("");
                setShowModal(true);
              }}
            >
              Add product
            </Button>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Product management</DialogTitle>
                <DialogDescription>
                  {type === "delete"
                    ? "Delete product"
                    : type === "edit"
                    ? "Edit product"
                    : "Add new product"}
                </DialogDescription>
              </DialogHeader>

              <ProductForm
                refetch={refetch}
                userData={userData}
                type={type}
                setShowModal={setShowModal}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="mt-6 ">
        {data && (
          <DataTable columns={columns} data={data} isFetching={isFetching} />
        )}
      </div>
    </div>
  );
}

export default Page;
