"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { generateReport } from "@/app/actions";
import { DataTable } from "./DataTable";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePickerWithRange } from "@/components/dashboard/DateRangePicker";
import { RiFileExcel2Line } from "react-icons/ri";
import { exportSalesToExcel } from "@/app/utils/exportToExcel";

interface Sale {
  orderDate: string;
  cashierName: string;
  cart: {
    productName: string;
    quantity: number;
  }[];
  paymentMethod: string;
  taxAmount: number;
  totalDiscount: number;
  finalTotal: number;
}

function Page() {
  const [type, setType] = React.useState("");
  const [rangePickerDate, setRangePickerDate] = React.useState({
    from: "",
    to: "",
  });

  const columns: ColumnDef<Sale>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "orderDate",
      header: ({ column, table }) => (
        <Button
          className="p-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Order Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="block">
          {new Date(row.original.orderDate).toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "cashierName",
      header: ({ column }) => (
        <Button
          className="p-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Cashier Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="block">{row.original.cashierName}</div>
      ),
    },
    {
      accessorKey: "cart",
      header: ({ column, table }) => (
        <Button
          className="p-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Products
          <ArrowUpDown className="ml-2 h-4 w-4" />
          <button
            {...{
              onClick: table.getToggleAllRowsExpandedHandler(),
            }}
          >
            {table.getIsAllRowsExpanded() ? "👇" : "👉"}
          </button>
        </Button>
      ),
      cell: ({ row, getValue }) => (
        <div className="block">
          {row.original.cart.map((item, index) => (
            <div key={index}>{item.productName}</div>
          ))}
          {row.getCanExpand() && (
            <button
              {...{
                onClick: row.getToggleExpandedHandler(),
                style: { cursor: "pointer" },
              }}
            >
              {row.getIsExpanded() ? "👇" : "👉"}
            </button>
          )}
        </div>
      ),
    },
    {
      accessorKey: "paymentMethod",
      header: ({ column }) => (
        <Button
          className="p-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Payment Method
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="block">{row.original.paymentMethod}</div>
      ),
    },
    {
      accessorKey: "taxAmount",
      header: ({ column }) => (
        <Button
          className="p-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tax Applied
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="block">{row.original.taxAmount > 0 ? "yes" : "no"}</div>
      ),
    },
    {
      accessorKey: "totalDiscount",
      header: ({ column }) => (
        <Button
          className="p-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Discount Applied
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="block">
          {row.original.totalDiscount > 0 ? "yes" : "no"}
        </div>
      ),
    },
    {
      accessorKey: "finalTotal",
      header: ({ column }) => (
        <Button
          className="p-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Final Total
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="block">{row.original.finalTotal.toFixed(2)}</div>
      ),
    },
  ];

  const getSales = async () => {
    const values = {
      startDate: rangePickerDate.from,
      endDate: rangePickerDate.to,
      type,
    };
    try {
      const response: any = await generateReport(values);
      return response.orders;
    } catch (error) {
      console.error(error);
    }
  };

  const { isFetching, isError, error, data, refetch } = useQuery({
    queryKey: ["sales", rangePickerDate, type],
    queryFn: getSales,
    staleTime: 5000,
  });

  return (
    <div className="">
      <div className="flex-col flex sm:flex-row gap-y-4 justify-between sm:items-center">
        <div>
          <h1 className="font-semibold">Sales Report</h1>
          <p className="text-sm">Generate sales report</p>
        </div>
        <Button
          onClick={() => exportSalesToExcel(data)}
          variant="destructive"
          className="gap-2"
        >
          <RiFileExcel2Line size={20} />
          Export to excel
        </Button>
      </div>

      <div className="pt-4">
        <DatePickerWithRange
          rangePickerDate={rangePickerDate}
          setRangePickerDate={setRangePickerDate}
        />
      </div>

      <div className="mt-6 ">
        {isFetching ? (
          <div>Loading...</div>
        ) : isError ? (
          <div>Error: {error.message}</div>
        ) : (
          <DataTable columns={columns} data={data} isFetching={isFetching} />
        )}
      </div>
    </div>
  );
}

export default Page;
