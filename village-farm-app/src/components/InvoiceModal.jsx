import { X, Printer, Download } from "lucide-react";

function InvoiceModal({
  open,
  onClose,
  order,
}) {
  if (!open || !order) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">

        {/* Header */}

        <div className="flex justify-between items-center border-b p-6">

          <h2 className="text-3xl font-bold">
            Invoice
          </h2>

          <button onClick={onClose}>
            <X size={26} />
          </button>

        </div>

        {/* Body */}

        <div className="p-6 space-y-6">

          <div className="flex justify-between">

            <div>

              <h3 className="text-xl font-bold">
                Village Fresh Farm
              </h3>

              <p>Fresh Products Delivery</p>

            </div>

            <div className="text-right">

              <p>
                <b>Invoice No:</b>
              </p>

              <p>{order.order_number}</p>

            </div>

          </div>

          <hr />

          {/* Customer */}

          <div>

            <h3 className="font-bold text-lg mb-2">
              Customer Details
            </h3>

            <p>{order.full_name}</p>

            <p>{order.mobile_number}</p>

            <p>
              {order.door_street},
              {" "}
              {order.village},
              {" "}
              {order.district}
            </p>

            <p>
              {order.state} - {order.pincode}
            </p>

          </div>

          <hr />

          {/* Products */}

          <table className="w-full">

            <thead>

              <tr className="border-b">

                <th className="text-left py-2">
                  Product
                </th>

                <th>Qty</th>

                <th>Price</th>

                <th>Total</th>

              </tr>

            </thead>

            <tbody>

              {order.items.map((item) => (

                <tr key={item.id} className="border-b">

                  <td className="py-3">
                    {item.product.product_name}
                  </td>

                  <td className="text-center">
                    {item.quantity}
                  </td>

                  <td className="text-center">
                    ₹{item.price}
                  </td>

                  <td className="text-center">
                    ₹{item.total}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          <hr />

          {/* Summary */}

          <div className="flex justify-end">

            <div className="w-72 space-y-2">

              <div className="flex justify-between">

                <span>Subtotal</span>

                <span>
                  ₹{order.total_amount}
                </span>

              </div>

              <div className="flex justify-between">

                <span>Delivery</span>

                <span>
                  ₹{order.delivery_charge}
                </span>

              </div>

              <div className="flex justify-between">

                <span>GST</span>

                <span>
                  ₹{order.gst}
                </span>

              </div>

              <hr />

              <div className="flex justify-between text-xl font-bold">

                <span>Grand Total</span>

                <span>
                  ₹{order.grand_total}
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* Footer */}

        <div className="border-t p-6 flex gap-4 justify-end">

          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-lg"
          >
            <Printer size={18} />
            Print
          </button>

          <button
            onClick={() =>
              alert("PDF download coming soon.")
            }
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg"
          >
            <Download size={18} />
            Download PDF
          </button>

        </div>

      </div>

    </div>
  );
}

export default InvoiceModal;