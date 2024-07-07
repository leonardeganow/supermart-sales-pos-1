import React from "react";
import { DataTable } from "./DataTable";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
async function getData(): Promise<any> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      fullname: "kweku frimpong",
      username: "kweku001",
      password: "324jksr239o@#!",
      type: "cashier",
    },
    {
      id: "728ed52f",
      fullname: "kweku frimpong",
      username: "kweku001",
      password: "324jksr239o@#!",
      type: "cashier",
    },
    {
      id: "728ed52f",
      fullname: "kweku frimpong",
      username: "kweku001",
      password: "324jksr239o@#!",
      type: "cashier",
    },
    // ...
  ];
}
async function Page() {
  const data = await getData();

  return (
    <div>
      <div className="flex-col flex sm:flex-row gap-y-4 justify-between sm:items-center">
        <div>
          <h1 className="font-semibold">User management</h1>
          <p className="text-sm">View, edit, and delete user accounts</p>
        </div>

        <div className="sm:flex-row sm:items-center gap-x-2 flex-col flex gap-y-4">
          <Dialog>
            <DialogTrigger>
              {" "}
              <Button>Add user</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>User management</DialogTitle>
                <DialogDescription>
            form goes here
                </DialogDescription>
              </DialogHeader>
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
