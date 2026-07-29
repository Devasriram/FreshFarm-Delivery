function PaymentSummary({
  paymentMethod,
  setPaymentMethod,
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-2xl font-bold mb-6">
        Payment Method
      </h2>

      <div className="space-y-4">

        {/* Cash On Delivery */}

        <label className="flex items-center justify-between border rounded-lg p-4 cursor-pointer hover:border-green-500">

          <div className="flex items-center gap-3">

            <input
              type="radio"
              value="Cash on Delivery"
              checked={
                paymentMethod ===
                "Cash on Delivery"
              }
              onChange={(e) =>
                setPaymentMethod(e.target.value)
              }
            />

            <div>
              <p className="font-semibold">
                Cash on Delivery
              </p>

              <p className="text-sm text-gray-500">
                Pay when your order is delivered.
              </p>
            </div>

          </div>

        </label>

        {/* Online Payment */}

        <label className="flex items-center justify-between border rounded-lg p-4 cursor-pointer hover:border-green-500">

          <div className="flex items-center gap-3">

            <input
              type="radio"
              value="Online Payment"
              checked={
                paymentMethod ===
                "Online Payment"
              }
              onChange={(e) =>
                setPaymentMethod(e.target.value)
              }
            />

            <div>

              <p className="font-semibold">
                Online Payment
              </p>

              <p className="text-sm text-gray-500">
                (Coming Soon)
              </p>

            </div>

          </div>

        </label>

      </div>

    </div>
  );
}

export default PaymentSummary;