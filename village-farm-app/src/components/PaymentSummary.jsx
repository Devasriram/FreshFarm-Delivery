import { useState } from "react";

function PaymentSummary() {
  const [paymentMethod, setPaymentMethod] = useState("cod");

  return (
    <div className="bg-white rounded-2xl shadow-md p-8">

      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Payment Method
      </h2>

      <div className="space-y-4">

        {/* Cash On Delivery */}

        <label className="flex items-center justify-between border rounded-xl p-4 cursor-pointer hover:border-green-600">

          <div>

            <h3 className="font-semibold">
              Cash On Delivery
            </h3>

            <p className="text-gray-500 text-sm">
              Pay when your order is delivered
            </p>

          </div>

          <input
            type="radio"
            name="payment"
            value="cod"
            checked={paymentMethod === "cod"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />

        </label>

        {/* UPI */}

        <label className="flex items-center justify-between border rounded-xl p-4 cursor-pointer hover:border-green-600">

          <div>

            <h3 className="font-semibold">
              UPI
            </h3>

            <p className="text-gray-500 text-sm">
              Google Pay / PhonePe / Paytm
            </p>

          </div>

          <input
            type="radio"
            name="payment"
            value="upi"
            checked={paymentMethod === "upi"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />

        </label>

        {/* Credit Card */}

        <label className="flex items-center justify-between border rounded-xl p-4 cursor-pointer hover:border-green-600">

          <div>

            <h3 className="font-semibold">
              Credit / Debit Card
            </h3>

            <p className="text-gray-500 text-sm">
              Visa • MasterCard • RuPay
            </p>

          </div>

          <input
            type="radio"
            name="payment"
            value="card"
            checked={paymentMethod === "card"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />

        </label>

        {/* Net Banking */}

        <label className="flex items-center justify-between border rounded-xl p-4 cursor-pointer hover:border-green-600">

          <div>

            <h3 className="font-semibold">
              Net Banking
            </h3>

            <p className="text-gray-500 text-sm">
              All major banks supported
            </p>

          </div>

          <input
            type="radio"
            name="payment"
            value="netbanking"
            checked={paymentMethod === "netbanking"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />

        </label>

        {/* Wallet */}

        <label className="flex items-center justify-between border rounded-xl p-4 cursor-pointer hover:border-green-600">

          <div>

            <h3 className="font-semibold">
              Wallet
            </h3>

            <p className="text-gray-500 text-sm">
              Amazon Pay • Mobikwik • Freecharge
            </p>

          </div>

          <input
            type="radio"
            name="payment"
            value="wallet"
            checked={paymentMethod === "wallet"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />

        </label>

      </div>

      <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-4">

        <h3 className="font-semibold text-green-700">
          Selected Payment Method
        </h3>

        <p className="mt-2 text-gray-700 capitalize">
          {paymentMethod === "cod" && "Cash On Delivery"}
          {paymentMethod === "upi" && "UPI"}
          {paymentMethod === "card" && "Credit / Debit Card"}
          {paymentMethod === "netbanking" && "Net Banking"}
          {paymentMethod === "wallet" && "Wallet"}
        </p>

      </div>

    </div>
  );
}

export default PaymentSummary;