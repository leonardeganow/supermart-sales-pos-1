"use server";

import connectToDatabase from "../libs/mongodb";
import OrderModel from "../models/Order";
import ProductModel from "../models/Products";

export async function fetchDashboardData(startDate: string, endDate: string) {
  try {
    await connectToDatabase();

    const start = new Date(startDate);
    const end = new Date(new Date(endDate).setHours(23, 59, 59, 999));

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

    return { totalQuantity, totalOrders, totalRevenue, totalProfit };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return {
      totalQuantity: 0,
      totalOrders: 0,
      totalRevenue: 0,
      totalProfit: 0,
    };
  }
}
