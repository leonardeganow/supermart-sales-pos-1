"use client";
import React from "react";
import { DataTable } from "./DataTable";
// import { columns } from "./columns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UsersForm from "./UsersForm";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Trigger } from "@radix-ui/react-dialog";

export type Payment = {
  id: string;
  username: string;
  fullname: string;
  email: string;
  password: string;
  type: string;
};

function Page() {
  const [type, setType] = React.useState("");
  const [userData, setUserData] = React.useState();
  const [showModal, setShowModal] = React.useState(false);
  const getUsers = async () => {
    try {
      const response = await axios.get("/api/getmanagedusers");

      if (response.data.status) {
        return response.data.users;
      }
    } catch (error) {
      console.error(error);
    }
  };
  const { isFetching, isError, data, error, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
    staleTime: 5000,
  });

  const columns: ColumnDef<Payment>[] = [
    {
      accessorKey: "name",
      header: "name",
    },
    {
      accessorKey: "username",
      header: "Username",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "role",
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

  return (
    <div>
      <div className="flex-col flex sm:flex-row gap-y-4 justify-between sm:items-center">
        <div>
          <h1 className="font-semibold">User management</h1>
          <p className="text-sm">View, edit, and delete user accounts</p>
        </div>

        <div className="sm:flex-row sm:items-center gap-x-2  gap-y-4">
          <Dialog open={showModal} onOpenChange={setShowModal}>
            <Button onClick={() => setShowModal(true)}>Add user</Button>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>User management</DialogTitle>
                <DialogDescription>
                  {type === "delete"
                    ? "Delete user"
                    : type === "edit"
                    ? "Edit user information"
                    : "Add new user"}
                </DialogDescription>
              </DialogHeader>
              <UsersForm refetch={refetch} userData={userData} type={type} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="mt-6">
        {data && (
          <DataTable isFetching={isFetching} columns={columns} data={data} />
        )}
      </div>
    </div>
  );
}

export default Page;
