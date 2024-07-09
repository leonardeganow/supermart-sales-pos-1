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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import ProductForm from "./ProductForm";
import { useQuery } from "@tanstack/react-query";

function Page() {
  const [type, setType] = React.useState("");
  const [userData, setUserData] = React.useState();
  const [showModal, setShowModal] = React.useState(false);

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <div
            className="flex items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        );
      },
    },

    {
      accessorKey: "quantity",
      header: ({ column }) => {
        return (
          <div
            className="flex items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Quantity
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        );
      },
    },
    {
      accessorKey: "inStock",
      header: ({ column }) => {
        return (
          <div
            className="flex items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            In stock
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        );
      },
      cell: ({ row }) => {
        const inStock = row.original.inStock ? (
          <div className="bg-green-500 rounded-lg"> in stock</div>
        ) : (
          <div className="bg-red-500  rounded-lg">out of stock</div>
        );

        return (
          <div className="text-center text-white font-medium">{inStock}</div>
        );
      },
    },
    {
      accessorKey: "category",
      header: ({ column }) => {
        return (
          <div
            className="flex items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Category
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        );
      },
    },
    {
      accessorKey: "basePrice",
      header: ({ column }) => {
        return (
          <div
            className="flex items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Base price
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        );
      },
    },
    {
      accessorKey: "sellingPrice",
      header: ({ column }) => {
        return (
          <div
            className="flex items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Selling price
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        );
      },
    },
    {
      accessorKey: "image",
      header: ({ column }) => {
        return (
          <div
            className="flex items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Image
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        );
      },
    },
    {
      accessorKey: "barcode",
      header: ({ column }) => {
        return (
          <div
            className="flex items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Barcode
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        );
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

  const data: Product[] = [
    {
      name: "Apple",
      quantity: 50,
      inStock: false,
      category: "Fruits",
      basePrice: 5,
      sellingPrice: 8,
      image: "apple.jpg",
      barcode: "1234567890001",
    },
    {
      name: "Banana",
      quantity: 30,
      inStock: true,
      category: "Fruits",
      basePrice: 3,
      sellingPrice: 5,
      image: "banana.jpg",
      barcode: "1234567890002",
    },
    {
      name: "Orange",
      quantity: 40,
      inStock: true,
      category: "Fruits",
      basePrice: 6,
      sellingPrice: 9,
      image: "orange.jpg",
      barcode: "1234567890003",
    },
    {
      name: "Milk",
      quantity: 20,
      inStock: true,
      category: "Dairy",
      basePrice: 10,
      sellingPrice: 15,
      image: "milk.jpg",
      barcode: "1234567890004",
    },
    {
      name: "Cheese",
      quantity: 15,
      inStock: true,
      category: "Dairy",
      basePrice: 20,
      sellingPrice: 30,
      image: "cheese.jpg",
      barcode: "1234567890005",
    },
    {
      name: "Bread",
      quantity: 25,
      inStock: false,
      category: "Bakery",
      basePrice: 12,
      sellingPrice: 18,
      image: "bread.jpg",
      barcode: "1234567890006",
    },
    {
      name: "Butter",
      quantity: 10,
      inStock: true,
      category: "Dairy",
      basePrice: 15,
      sellingPrice: 22,
      image: "butter.jpg",
      barcode: "1234567890007",
    },
    {
      name: "Eggs",
      quantity: 60,
      inStock: true,
      category: "Dairy",
      basePrice: 25,
      sellingPrice: 35,
      image: "eggs.jpg",
      barcode: "1234567890008",
    },
    {
      name: "Chicken Breast",
      quantity: 35,
      inStock: false,
      category: "Meat",
      basePrice: 30,
      sellingPrice: 45,
      image: "chicken.jpg",
      barcode: "1234567890009",
    },
    {
      name: "Beef Steak",
      quantity: 20,
      inStock: true,
      category: "Meat",
      basePrice: 50,
      sellingPrice: 70,
      image: "beef.jpg",
      barcode: "1234567890010",
    },
    {
      name: "Carrot",
      quantity: 40,
      inStock: true,
      category: "Vegetables",
      basePrice: 4,
      sellingPrice: 6,
      image: "carrot.jpg",
      barcode: "1234567890011",
    },
    {
      name: "Tomato",
      quantity: 50,
      inStock: true,
      category: "Vegetables",
      basePrice: 5,
      sellingPrice: 8,
      image: "tomato.jpg",
      barcode: "1234567890012",
    },
    {
      name: "Potato",
      quantity: 70,
      inStock: true,
      category: "Vegetables",
      basePrice: 3,
      sellingPrice: 5,
      image: "potato.jpg",
      barcode: "1234567890013",
    },
    {
      name: "Onion",
      quantity: 45,
      inStock: true,
      category: "Vegetables",
      basePrice: 4,
      sellingPrice: 6,
      image: "onion.jpg",
      barcode: "1234567890014",
    },
    {
      name: "Garlic",
      quantity: 20,
      inStock: true,
      category: "Vegetables",
      basePrice: 8,
      sellingPrice: 12,
      image: "garlic.jpg",
      barcode: "1234567890015",
    },
    {
      name: "Rice",
      quantity: 100,
      inStock: true,
      category: "Grains",
      basePrice: 10,
      sellingPrice: 15,
      image: "rice.jpg",
      barcode: "1234567890016",
    },
    {
      name: "Pasta",
      quantity: 80,
      inStock: true,
      category: "Grains",
      basePrice: 12,
      sellingPrice: 18,
      image: "pasta.jpg",
      barcode: "1234567890017",
    },
    {
      name: "Olive Oil",
      quantity: 25,
      inStock: true,
      category: "Oils",
      basePrice: 30,
      sellingPrice: 45,
      image: "oliveoil.jpg",
      barcode: "1234567890018",
    },
    {
      name: "Sunflower Oil",
      quantity: 30,
      inStock: true,
      category: "Oils",
      basePrice: 25,
      sellingPrice: 35,
      image: "sunfloweroil.jpg",
      barcode: "1234567890019",
    },
    {
      name: "Salt",
      quantity: 60,
      inStock: true,
      category: "Spices",
      basePrice: 2,
      sellingPrice: 3,
      image: "salt.jpg",
      barcode: "1234567890020",
    },
    {
      name: "Pepper",
      quantity: 40,
      inStock: true,
      category: "Spices",
      basePrice: 8,
      sellingPrice: 12,
      image: "pepper.jpg",
      barcode: "1234567890021",
    },
    {
      name: "Sugar",
      quantity: 50,
      inStock: true,
      category: "Sweeteners",
      basePrice: 5,
      sellingPrice: 8,
      image: "sugar.jpg",
      barcode: "1234567890022",
    },
    {
      name: "Honey",
      quantity: 20,
      inStock: true,
      category: "Sweeteners",
      basePrice: 40,
      sellingPrice: 60,
      image: "honey.jpg",
      barcode: "1234567890023",
    },
    {
      name: "Coffee",
      quantity: 35,
      inStock: true,
      category: "Beverages",
      basePrice: 50,
      sellingPrice: 70,
      image: "coffee.jpg",
      barcode: "1234567890024",
    },
    {
      name: "Tea",
      quantity: 40,
      inStock: true,
      category: "Beverages",
      basePrice: 25,
      sellingPrice: 35,
      image: "tea.jpg",
      barcode: "1234567890025",
    },
    {
      name: "Juice",
      quantity: 30,
      inStock: true,
      category: "Beverages",
      basePrice: 15,
      sellingPrice: 25,
      image: "juice.jpg",
      barcode: "1234567890026",
    },
    {
      name: "Soda",
      quantity: 45,
      inStock: true,
      category: "Beverages",
      basePrice: 10,
      sellingPrice: 15,
      image: "soda.jpg",
      barcode: "1234567890027",
    },
    {
      name: "Water",
      quantity: 100,
      inStock: true,
      category: "Beverages",
      basePrice: 5,
      sellingPrice: 8,
      image: "water.jpg",
      barcode: "1234567890028",
    },
    {
      name: "Chocolate",
      quantity: 25,
      inStock: true,
      category: "Snacks",
      basePrice: 10,
      sellingPrice: 15,
      image: "chocolate.jpg",
      barcode: "1234567890029",
    },
    {
      name: "Cookies",
      quantity: 30,
      inStock: true,
      category: "Snacks",
      basePrice: 15,
      sellingPrice: 20,
      image: "cookies.jpg",
      barcode: "1234567890030",
    },
  ];

  const getProducts = async () => {
    try {
    } catch (error) {}
  };
  const { isFetching, isError, error, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: getProducts,
    staleTime: 5000,
  });

  return (
    <div>
      <div className="flex-col flex sm:flex-row gap-y-4 justify-between sm:items-center">
        <div>
          <h1 className="font-semibold">Product management</h1>
          <p className="text-sm">View, edit, and delete your products</p>
        </div>

        <div className="sm:flex-row sm:items-center gap-x-2  gap-y-4">
          <Dialog open={showModal} onOpenChange={setShowModal}>
            <Button onClick={() => setShowModal(true)}>Add product</Button>

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

      <div className="mt-6">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}

export default Page;
