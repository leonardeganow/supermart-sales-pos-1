"use server";

import { getLastSixMonths } from "../helpers";
import connectToDatabase from "../libs/mongodb";
import OrderModel from "../models/Order";
import ProductModel from "../models/Products";

export async function fetchDashboardData(startDate: string, endDate: string) {
  try {
    await connectToDatabase();

    const start = new Date(startDate);
    const end = new Date(new Date(endDate).setHours(23, 59, 59, 999));

    const month = start.getMonth();
    console.log(month);

    // Aggregate total stock quantity
    const totalStock = await ProductModel.aggregate([
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: "$quantity" },
        },
      },
    ]);

    // Aggregate total revenue within the date range
    const totalMoneyCollected = await OrderModel.aggregate([
      {
        $match: {
          orderDate: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$finalTotal" },
        },
      },
    ]);

    // Calculate total cost of goods sold (COGS) within the date range
    const soldProducts = await OrderModel.aggregate([
      { $unwind: "$cart" },
      {
        $match: {
          orderDate: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: "$cart.productId",
          totalSoldQuantity: { $sum: "$cart.quantity" },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $group: {
          _id: null,
          totalCost: {
            $sum: { $multiply: ["$totalSoldQuantity", "$product.basePrice"] },
          },
        },
      },
    ]);

    const totalRevenue = totalMoneyCollected[0]?.totalRevenue || 0;
    const totalCOGS = soldProducts[0]?.totalCost || 0;
    const totalProfit = totalRevenue - totalCOGS;

    const totalQuantity =
      totalStock.length > 0 ? totalStock[0].totalQuantity : 0;

    // Fetch total orders within the date range
    const totalOrders = await OrderModel.countDocuments({
      orderDate: { $gte: start, $lte: end },
    });

    // Calculate sales count for each of the past 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlySales = await OrderModel.aggregate([
      {
        $match: {
          orderDate: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$orderDate" },
            month: { $month: "$orderDate" },
          },
          salesCount: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          salesCount: 1,
        },
      },
    ]);

    const lastSixMonths = getLastSixMonths();
    const chartData = lastSixMonths.map((month) => {
      const salesData = monthlySales.find(
        (data) => data.year === month.year && data.month === month.month
      );
      return {
        month: month.monthName,
        sales: salesData ? salesData.salesCount : 0,
      };
    });

    const paymentMethods = await OrderModel.aggregate([
      {
        $group: {
          _id: {
            month: {
              $month: "$orderDate",
            },
            year: {
              $year: "$orderDate",
            },
            paymentMethod: "$paymentMethod",
          },
          count: {
            $sum: 1,
          },
        },
      },
      {
        $group: {
          _id: {
            month: "$_id.month",
            year: "$_id.year",
          },
          paymentMethods: {
            $push: {
              type: "$_id.paymentMethod",
              count: "$count",
              fill: "hsl(var(--chart-1))",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          year: "$_id.year",
          paymentMethods: 1,
        },
      },
      {
        $sort: {
          year: 1,
          month: 1,
        },
      },
    ]);

    const paymentMethodsCount = paymentMethods[0];

    return {
      totalQuantity,
      totalOrders,
      totalRevenue,
      totalProfit,
      chartData,
      paymentMethodsCount,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return {
      totalQuantity: 0,
      totalOrders: 0,
      totalRevenue: 0,
      totalProfit: 0,
      chartData: 0,
    };
  }
}
