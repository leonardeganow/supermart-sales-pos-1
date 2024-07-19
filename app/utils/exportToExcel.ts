import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

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

export async function exportSalesToExcel(sales: Sale[]) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sales Report");

  // Add header row
  worksheet.columns = [
    { header: "Order Date", key: "orderDate", width: 20 },
    { header: "Cashier Name", key: "cashierName", width: 20 },
    { header: "Products", key: "products", width: 30 },
    { header: "Payment Method", key: "paymentMethod", width: 20 },
    { header: "Tax Applied", key: "taxAmount", width: 10 },
    { header: "Discount Applied", key: "totalDiscount", width: 10 },
    { header: "Final Total", key: "finalTotal", width: 15 },
  ];

  // Add data rows
  sales.forEach((sale) => {
    worksheet.addRow({
      orderDate: new Date(sale.orderDate).toLocaleString(),
      cashierName: sale.cashierName,
      products: sale.cart
        .map((item) => `${item.productName} (x${item.quantity})`)
        .join(", "),
      paymentMethod: sale.paymentMethod,
      taxAmount: sale.taxAmount > 0 ? "yes" : "no",
      totalDiscount: sale.totalDiscount > 0 ? "yes" : "no",
      finalTotal: sale.finalTotal.toFixed(2),
    });
  });

  // Generate Excel file and prompt download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, "Sales_Report.xlsx");
}
