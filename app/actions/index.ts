"use server";
import mongoose from "mongoose";
import { getLastSixMonths } from "../helpers";
import connectToDatabase from "../libs/mongodb";
import { getCurrentUser } from "../libs/session";
import { checkAdminRole } from "../middlewares/authMiddleware";
import OrderModel from "../models/Order";
import ProductModel from "../models/Products";
import SupplierModel from "../models/Supplier";
import SupermartModel from "../models/Supermarket";
import UserModel from "../models/User";
import bcrypt from "bcrypt";

export async function fetchDashboardData(startDate: string, endDate: string) {
  try {
    const user = await getCurrentUser();

    const supermarketId = new mongoose.Types.ObjectId(user.supermarketId);

    await connectToDatabase();

    const start = new Date(startDate);
    const end = new Date(new Date(endDate).setHours(23, 59, 59, 999));

    // Aggregate total stock quantity by supermarket
    const totalStock = await ProductModel.aggregate([
      { $match: { supermarketId: supermarketId } },
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: "$quantity" },
        },
      },
    ]);

    // Aggregate total revenue within the date range by supermarket
    const totalMoneyCollected = await OrderModel.aggregate([
      {
        $match: {
          supermarketId: supermarketId,
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

    // Calculate total cost of goods sold (COGS) within the date range by supermarket
    const soldProducts = await OrderModel.aggregate([
      { $unwind: "$cart" },
      {
        $match: {
          supermarketId: supermarketId,
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

    // Fetch total orders within the date range by supermarket
    const totalOrders = await OrderModel.countDocuments({
      supermarketId: supermarketId,
      orderDate: { $gte: start, $lte: end },
    });

    // Calculate sales count for each of the past 6 months by supermarket
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlySales = await OrderModel.aggregate([
      {
        $match: {
          supermarketId: supermarketId,
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
        $match: {
          supermarketId: supermarketId,
        },
      },
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
      chartData: [],
    };
  }
}

export async function createSupplier(param: any) {
  try {
    console.log(param);

    const user = await getCurrentUser();

    await connectToDatabase();
    const supplier = new SupplierModel({
      name: param.name,
      location: param.location,
      telephone: param.telephone,
      product: param.product,
      supermarketId: user.supermarketId,
    });
    supplier.save();

    return {
      message: "Supplier created successfully",
      status: true,
    };
  } catch (error: any) {
    console.error("Error creating supplier:", error);
    return {
      message: "Internal Server Error",
      error: error.message,
    };
  }
}

export async function getSuppliers() {
  try {
    const currentUser = await getCurrentUser();

    // Check if the requester is an admin
    const middlewareResponse = await checkAdminRole({ body: currentUser });
    if (middlewareResponse) return middlewareResponse;

    await connectToDatabase();

    // Fetch suppliers created by the admin
    const suppliers = await SupplierModel.find({
      supermarketId: currentUser.supermarketId,
    });

    return {
      message: "Users fetched successfully",
      suppliers,
      status: true,
    };
  } catch (error: any) {
    console.error("Error fetching suppliers:", error);
    return {
      message: "Internal Server Error",
      error: error.message,
    };
  }
}

export async function deleteSupplier(params: { supplierId: string }) {
  try {
    const currentUser = await getCurrentUser();
    if (currentUser) {
      const middlewareResponse = await checkAdminRole({ body: currentUser });
      if (middlewareResponse) return middlewareResponse;
    }

    await connectToDatabase();

    // Find and delete the user
    const supplierToDelete = await SupplierModel.findById(params.supplierId);
    if (!supplierToDelete) {
      return {
        message: "Supplier not found",
        status: false,
      };
    }

    await SupplierModel.findByIdAndDelete(params.supplierId);
    return {
      message: "Supplier deleted successfully",
      status: true,
    };
  } catch (error: any) {
    console.error("Error deleting supplier:", error);
    return {
      message: "Internal Server Error",
      error: error.message,
    };
  }
}

export async function editSupplier(params: any) {
  try {
    const currentUser = await getCurrentUser();
    if (currentUser) {
      const middlewareResponse = await checkAdminRole({ body: currentUser });
      if (middlewareResponse) return middlewareResponse;
    }

    await connectToDatabase();
    const supplier = await SupplierModel.findOne({ _id: params.supplierId });

    if (!supplier) {
      return { message: "Product not found" };
    }

    // Update other product fields
    if (params.name) supplier.name = params.name;
    if (params.location) supplier.location = params.location;
    if (params.telephone) supplier.telephone = params.telephone;
    if (params.product) supplier.product = params.product;

    await supplier.save();

    return {
      message: "Supplier updated successfully",
      status: true,
    };
  } catch (error: any) {
    console.error("Error editing supplier:", error);
    return {
      message: "Internal Server Error",
      error: error.message,
    };
  }
}

export async function getSupermarketName() {
  try {
    const user = await getCurrentUser();

    await connectToDatabase();

    const supermarket = await SupermartModel.findById(user.supermarketId);

    if (!supermarket) {
      return { message: "Supermarket not found", status: "false" };
    }

    return {
      message: "Supermarket fetched successfully",
      supermarketName: supermarket.name,
      status: true,
    };
  } catch (error) {
    console.error("Error fetching supermarket name:", error);
    return { message: "Internal Server Error", status: "false" };
  }
}

export async function editAccountInfo(params: any) {
  try {
    const currentUser = await getCurrentUser();

    await connectToDatabase();

    const user = await UserModel.findByIdAndUpdate(currentUser.id, {
      $set: {
        name: params.name,
        phone: params.phone,
        username: params.username,
      },
    });

    return {
      message: "Account info updated successfully",
      status: true,
    };
  } catch (error) {
    console.error("Error updating account info:", error);
    return { message: "Internal Server Error", status: false };
  }
}

export async function changePassword(params: any) {
  try {
    const currentUser = await getCurrentUser();
    await connectToDatabase();

    const user = await UserModel.findById(currentUser.id);

    if (!user) {
      return { message: "User not found", status: false };
    }

    //compare current password with old password
    const isPasswordCorrect = await bcrypt.compare(
      params.current,
      user.password
    );

    if (!isPasswordCorrect) {
      return { message: "Current password is incorrect", status: false };
    }

    //hash the new password
    const hashedPassword = await bcrypt.hash(params.new, 10);
    user.password = hashedPassword;

    await user.save();

    return { message: "Password changed successfully", status: true };
  } catch (error) {
    console.error("Error changing password:", error);
    return { message: "Internal Server Error", status: false };
  }
}

export async function generateReport(params: any) {
  try {
    const currentUser = await getCurrentUser();
    if (currentUser) {
      const middlewareResponse = await checkAdminRole({
        body: currentUser,
      });
      if (middlewareResponse) return middlewareResponse;
    }

    await connectToDatabase();

    const supermarketId = new mongoose.Types.ObjectId(
      currentUser.supermarketId
    );
    const cashierId = new mongoose.Types.ObjectId(params.cashierId);

    //query sales made by cashier  ove a period of time
    const sales = await OrderModel.aggregate([
      {
        $match: {
          supermarketId: supermarketId,
          // cashierId: cashierId,
          orderDate: {
            $gte: params.startDate,
            $lte: params.endDate,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalSales: {
            $sum: "$finalTotal",
          },
        },
      },
    ]);

    console.log(sales);
  } catch (error) {
    console.error("Error generating report:", error);
    return { message: "Internal Server Error" };
  }
}
