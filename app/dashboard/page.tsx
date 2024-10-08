"use client";
import React, { useEffect, useState } from "react";
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
import { fetchDashboardData, getSupermarketName } from "../actions";
import { useQuery } from "@tanstack/react-query";
import { Loader2, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

function Page() {
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  const [supermarketName, setSupermarketName] = useState("");
  const [rangePickerDate, setRangePickerDate] = React.useState({
    from: "",
    to: "",
  });

  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  const onSubmit = () => {
    setDateRange({
      startDate: rangePickerDate.from,
      endDate: rangePickerDate.to,
    });
  };

  const handleDateChange = (startDate: string, endDate: string) => {
    setDateRange({ startDate, endDate });
  };

  const handleSelectChange = (value: string) => {
    setSelectedPeriod(value);
    const today = new Date();
    let startDate, endDate;

    switch (value) {
      case "today":
        startDate = endDate = today.toISOString().split("T")[0];
        break;
      case "week":
        startDate = new Date(today.setDate(today.getDate() - 7))
          .toISOString()
          .split("T")[0];
        endDate = new Date().toISOString().split("T")[0];
        break;
      case "3months":
        startDate = new Date(today.setMonth(today.getMonth() - 3))
          .toISOString()
          .split("T")[0];
        endDate = new Date().toISOString().split("T")[0];
        break;
      case "6months":
        startDate = new Date(today.setMonth(today.getMonth() - 6))
          .toISOString()
          .split("T")[0];
        endDate = new Date().toISOString().split("T")[0];
        break;
      default:
        startDate = endDate = today.toISOString().split("T")[0];
        break;
    }

    handleDateChange(startDate, endDate);
  };

  const { isFetching, isError, error, data, refetch } = useQuery({
    queryKey: ["dashboarddata", dateRange],
    queryFn: async () => {
      try {
        const response = await fetchDashboardData(
          dateRange.startDate,
          dateRange.endDate
        );
        return response;
      } catch (error) {
        console.log(error);
      }
    },
    staleTime: 5000,
  });

  const dashWidgets = [
    {
      title: "Total revenue",
      icon: "",
      value: data?.totalRevenue,
      currency: "Ghs",
      // stat: "20.1% from last month",
    },
    {
      title: "Total sales",
      icon: "",
      value: data?.totalOrders,
      valueIncrease: true,
      increase: true,
      // stat: "20.1% from last month",
    },
    {
      title: "Total profit",
      icon: "",
      value: data?.totalProfit,
      currency: "Ghs",
      // stat: "54.1% from last month",
    },
    {
      title: "Stock available",
      icon: "",
      value: data?.totalQuantity,
      valueIncrease: true,
      increase: true,
      // stat: "10.1% from last month",
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
          {isFetching ? (
            <Loader2 className=" animate-spin" />
          ) : (
            <div>
              {widget.currency ? (
                <h1 className="text-xl font-bold">
                  +{widget.currency === "Ghs" ? "₵" : ""}
                  {widget.value
                    ? new Intl.NumberFormat().format(widget.value)
                    : 0}
                </h1>
              ) : (
                <h1 className="text-xl font-bold">
                  {/* {widget.valueIncrease ? "+" : ""} */}
                  {widget.value
                    ? new Intl.NumberFormat().format(widget.value)
                    : 0}
                </h1>
              )}
              {/* <p className="text-xs text-muted-foreground">
              {widget.increase ? "+" : "-"}
              {widget.stat}
            </p> */}
            </div>
          )}
        </div>
      );
    });
  };

  const getSupermarketNameHandler = async () => {
    try {
      const response: any = await getSupermarketName();
      if (response.status) {
        setSupermarketName(response.supermarketName);
      }
      if (!response.status) {
        toast(response.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("internal server error");
    }
  };

  useEffect(() => {
    getSupermarketNameHandler();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6 text-primary flex items-center gap-x-1">
        Welcome,{" "}
        {supermarketName ? (
          <span className="text-red-600">{supermarketName}</span>
        ) : (
          <Skeleton className="w-20 h-4 " />
        )}{" "}
      </h1>
      <div className="flex-col flex sm:flex-row gap-y-4 justify-between sm:items-center">
        <div>
          <h1 className="font-semibold">Dashboard</h1>
          <p className="text-sm">Analytics for your store</p>
        </div>

        <div className="sm:flex-row sm:items-center gap-x-2 flex-col flex gap-y-4">
          <Select value={selectedPeriod} onValueChange={handleSelectChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">1 week</SelectItem>
              <SelectItem value="3months">3 Months</SelectItem>
              <SelectItem value="6months">6 Months</SelectItem>
            </SelectContent>
          </Select>
          <DatePickerWithRange
            rangePickerDate={rangePickerDate}
            setRangePickerDate={setRangePickerDate}
          />
          <Button onClick={onSubmit} variant="outline" size="icon">
            {isFetching ? (
              <Loader2 className=" animate-spin" />
            ) : (
              <SearchIcon />
            )}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 sm:grid-cols-2 mt-6 gap-5">
        {renderWidgets()}
      </div>

      <div className="grid sm:grid-cols-2 gap-5 mt-6">
        <div>
          <DashboardAreaChart chartData={data?.chartData} />
        </div>
        <DashboardPieChart chartData={data?.paymentMethodsCount} />
      </div>
      <div className="mt-6 border rounded-lg">
        <h1 className="capitalize text-lg font-bold p-5">popular products</h1>
        <DashboardTable />
      </div>
    </div>
  );
}

export default Page;
