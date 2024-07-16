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
import { useQuery } from "@tanstack/react-query";
import SupplierForm from "./SupplierForm";
import { DataTable } from "./DataTable";
import { getSuppliers } from "@/app/actions";
function Page() {
  const [type, setType] = React.useState("");
  const [userData, setUserData] = React.useState();
  const [showModal, setShowModal] = React.useState(false);

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            className=" p-0"
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
      accessorKey: "location",

      header: ({ column }) => {
        return (
          <Button
            className=" p-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Location
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="block">{row.original.location}</div>;
      },
    },

    {
      accessorKey: "telephone",
      header: ({ column }) => {
        return (
          <Button
            className=" p-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Telephone
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="block">{row.original.telephone}</div>;
      },
    },
    {
      accessorKey: "product",
      header: ({ column }) => {
        return (
          <Button
            className=" p-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Product
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="block">{row.original.product}</div>;
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

  const getSupplierHandler = async () => {
    try {
      const response: any = await getSuppliers();

      if (response.status) {
        return response.suppliers;
      }
    } catch (error) {
      console.error(error);
    }
  };
  const { isFetching, isError, error, data, refetch } = useQuery({
    queryKey: ["suppliers"],
    queryFn: getSupplierHandler,
    staleTime: 5000,
  });

  return (
    <div className="">
      <div className="flex-col flex sm:flex-row gap-y-4 justify-between sm:items-center">
        <div>
          <h1 className="font-semibold">Supplier management</h1>
          <p className="text-sm">View, edit, and delete your supplier</p>
        </div>

        <div className="sm:flex-row sm:items-center gap-x-2  gap-y-4">
          <Dialog open={showModal} onOpenChange={setShowModal}>
            <Button
              onClick={() => {
                setType("");
                setShowModal(true);
              }}
            >
              Add supplier
            </Button>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Supplier management</DialogTitle>
                <DialogDescription>
                  {type === "delete"
                    ? "Delete supplier"
                    : type === "edit"
                    ? "Edit supplier"
                    : "Add new supplier"}
                </DialogDescription>
              </DialogHeader>

              <SupplierForm
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
