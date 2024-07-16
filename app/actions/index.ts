"use server";

import { getLastSixMonths } from "../helpers";
import connectToDatabase from "../libs/mongodb";
import { getCurrentUser } from "../libs/session";
import { checkAdminRole } from "../middlewares/authMiddleware";
import OrderModel from "../models/Order";
import ProductModel from "../models/Products";
import SupplierModel from "../models/Supplier";

export async function fetchDashboardData(startDate: string, endDate: string) {
  try {
    await connectToDatabase();

    const start = new Date(startDate);
    const end = new Date(new Date(endDate).setHours(23, 59, 59, 999));

    const month = start.getMonth();

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
      createdBy: user.id,
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
    const suppliers = await SupplierModel.find({ createdBy: currentUser.id });

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
