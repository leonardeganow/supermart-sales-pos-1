import React from "react";
import { DatePickerWithRange } from "@/components/dashboard/DateRangePicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardAreaChart } from "@/components/dashboard/DashboardAreaChart";
import { DashboardPieChart } from "@/components/dashboard/Piechart";
import { DashboardTable } from "@/components/dashboard/DashboardTable";


function Page() {
  const dashWidgets = [
    {
      title: "Total revenue",
      icon: "",
      value: "43,231.89",
      currency: "Ghs",
      stat: "20.1% from last month",
    },
    {
      title: "Total sales",
      icon: "",
      value: "467",
      valueIncrease: true,
      increase: true,
      stat: "20.1% from last month",
    },
    {
      title: "Total profit",
      icon: "",
      value: "143,000.89",
      currency: "Ghs",
      stat: "54.1% from last month",
    },
    {
      title: "Stock available",
      icon: "",
      value: "573",
      valueIncrease: true,
      increase: true,
      stat: "10.1% from last month",
    },
  ];

  const renderWidgets = () => {
    return dashWidgets.map((widget, i) => {
      return (
        <div
          key={i}
          className="shadow border flex flex-col gap-y-2 rounded-xl p-5"
        >
          <div className="flex justify-between">
            <h1 className="font-semibold capitalize text-sm">{widget.title}</h1>
            <p>{widget.icon}</p>
          </div>
          <div>
            {widget.currency ? (
              <h1 className="text-xl font-bold">
                {widget.currency === "Ghs" ? "₵" : ""}
                {widget.value}
              </h1>
            ) : (
              <h1 className="text-xl font-bold">
                {widget.valueIncrease ? "+" : ""}
                {widget.value}
              </h1>
            )}
            <p className="text-xs text-muted-foreground">
              {widget.increase ? "+" : "-"}
              {widget.stat}
            </p>
          </div>
        </div>
      );
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6 text-primary">
        Welcome, <span className="text-red-600">Shop n Save</span>{" "}
      </h1>
      <div className="flex-col flex sm:flex-row gap-y-4 justify-between sm:items-center">
        <div>
          <h1 className="font-semibold">Dashboard</h1>
          <p className="text-sm">Analytics for your store</p>
        </div>

        <div className="sm:flex-row sm:items-center gap-x-2 flex-col flex gap-y-4">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Today" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">1 week</SelectItem>
              <SelectItem value="3months">3 Months</SelectItem>
              <SelectItem value="6months">6 Months</SelectItem>
            </SelectContent>
          </Select>
          <DatePickerWithRange />
        </div>
      </div>

      <div className="grid lg:grid-cols-4 sm:grid-cols-2 mt-6 gap-5">
        {renderWidgets()}
      </div>

      <div className="grid sm:grid-cols-2 gap-5 mt-6">
        <div>
          <DashboardAreaChart />
        </div>
        <DashboardPieChart />
      </div>
      <div className="mt-6 border rounded-lg">
        <h1 className="capitalize text-lg font-bold p-5">popular products</h1>
        <DashboardTable />
      </div>
    </div>
  );
}

export default Page;
