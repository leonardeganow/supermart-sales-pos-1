import React from "react";

function Receipt(props: any) {
  return (
    <div
      ref={props.componentRef}
      className="grid min-h-[30dvh] place-items-center "
    >
      <div className="mt-4 p-4 bg-white rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-center">Supermarket</h2>
        <div className="flex flex-col items-center">
          {/* <p>Date: {new Date().toLocaleString()}</p> */}
          <p>Location: Accra</p>
          <p>Tel: 0302451236</p>
        </div>
        <hr className="my-4" />
        {props.cart.map((product: any) => (
          <div key={product._id} className="flex justify-between py-3">
            <p>{product.name}</p>
            <p>
              {product.quantity} x {product.currency === "GHS" ? "₵" : "$"}
              {product.totalPrice.toFixed(2)}
            </p>
          </div>
        ))}
        <hr className="my-4" />
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
        <hr className="my-4" />
        <div className="flex justify-between">
          <p>Total:</p>
          <p>{props.finalTotal.toFixed(2)}</p>
        </div>

        <div className="flex justify-center">
          <p>Thank you</p>
        </div>
      </div>

      {/* <button onClick={handlePrint}>Print</button> */}
    </div>
  );
}

export default Receipt;
