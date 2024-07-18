import React from "react";

function Receipt(props: any) {
  return (
    <div
      ref={props.componentRef}
      className="grid min-h-[30dvh] place-items-center w-full  "
    >
      <div className="mt-4 p-4  shadow-lg w-[400px]">
        <h2 className="text-xl font-bold text-center">
          {props?.receiptData?.supermarketName}
        </h2>
        <div className="flex flex-col items-center text-sm">
          {/* <p>Date: {new Date().toLocaleString()}</p> */}
          <p>Location: {props?.receiptData?.supermarketLocation}</p>
          <p>Tel: {props?.receiptData?.supermarketNumber}</p>
          <p>Https://www.quickmart.com</p>
        </div>
        <hr className="my-4 border-dashed border-black dark:border-white" />
        <div className="flex flex-col items-center text-sm">
          <p>SALES RECEIPT</p>
          <p>{props?.receiptData?.orderTime.split("T")[0]}</p>
          <p>Order Id: {props?.receiptData?.orderId}</p>
          <p>Cashier: {props?.receiptData?.cashierName}</p>
        </div>
        <hr className="my-4 border-dashed border-black dark:border-white" />
        {props.cart.map((product: any) => (
          <div key={product._id} className="flex justify-between py-3">
            <p className="font-bold">{product.name}</p>
            <p>
              {product.quantity} x {product.currency === "GHS" ? "₵" : "$"}
              {product.totalPrice.toFixed(2)}
            </p>
          </div>
        ))}
        <hr className="my-4 border-dashed border-black dark:border-white" />
        <div className="flex justify-between">
          <p>Sub Total:</p>
          <p>{props.totalBeforeDiscount.toFixed(2)}</p>
        </div>
        <div className="flex justify-between">
          <p>Discount:</p>
          <p>-{props.totalDiscount.toFixed(2)}</p>
        </div>
        {props.taxPayable !== 0 && (
          <div className="flex justify-between">
            <p>Tax:</p>
            <p>{props.taxPayable.toFixed(2)}</p>
          </div>
        )}
        <hr className="my-4 border-dashed border-black dark:border-white" />
        <div className="flex justify-between">
          <p>Total:</p>
          <p>{props.finalTotal.toFixed(2)}</p>
        </div>
        <div className="flex justify-between">
          <p>Payment type:</p>
          <p>{props?.receiptData?.paymentMethod}</p>
        </div>

        <div className="grid place-items-center">
          <p className="pt-10">***Goods sold are not returnable***</p>
          <p>***Thanks for shopping!!!***</p>
          <p className="py-4">---Quickmart pos by Leonard Adjei---</p>
          <p className="text-sm">
            ---Go to Https://quickmart.com for more details---
          </p>
        </div>
      </div>

      {/* <button onClick={handlePrint}>Print</button> */}
    </div>
  );
}

export default Receipt;
