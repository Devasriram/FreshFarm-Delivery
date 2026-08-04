import {
  CheckCircle,
  ClipboardList,
  Package,
  Truck,
  Home,
} from "lucide-react";

const STEPS = [
  {
    key: "Pending",
    title: "Order Placed",
    icon: ClipboardList,
    description: "Order placed successfully and is pending confirmation.",
  },
  {
    key: "Confirmed",
    title: "Order Confirmed",
    icon: CheckCircle,
    description: "Your order has been confirmed by our team.",
  },
  {
    key: "Preparing",
    title: "Preparing",
    icon: Package,
    description: "Fresh products are being packed.",
  },
  {
    key: "Out for Delivery",
    title: "Out for Delivery",
    icon: Truck,
    description: "Your order is on the way.",
  },
  {
    key: "Delivered",
    title: "Delivered",
    icon: Home,
    description: "Order delivered successfully.",
  },
];

function OrderTrackingTimeline({ tracking }) {
  if (!tracking) return null;

  const currentIndex = STEPS.findIndex(
    (step) => step.key === tracking.current_status
  );

  return (
    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="text-xl font-bold mb-8">
        Order Tracking Timeline
      </h2>

      {/* Top Progress */}
      <div className="flex justify-between items-center mb-10">

        {STEPS.map((step, index) => {

          const Icon = step.icon;

          const completed = index < currentIndex;
          const current = index === currentIndex;

          return (

            <div
              key={step.key}
              className="flex-1 flex flex-col items-center relative"
            >

              {index !== STEPS.length - 1 && (
                <div
                  className={`absolute top-5 left-1/2 w-full h-1 ${
                    completed
                      ? "bg-green-600"
                      : "bg-gray-300"
                  }`}
                />
              )}

              <div
                className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2
                ${
                  completed || current
                    ? "bg-green-600 border-green-600 text-white"
                    : "bg-white border-gray-300 text-gray-400"
                }`}
              >
                <Icon size={18} />
              </div>

              <span className="text-sm font-semibold mt-3 text-center">
                {step.title}
              </span>

            </div>

          );
        })}

      </div>

      {/* Detailed Timeline */}

      <div className="space-y-5">

        {STEPS.map((step, index) => {

          const Icon = step.icon;

          const history = tracking.history.find(
            (h) => h.status === step.key
          );

          const completed = !!history;

          const current =
            tracking.current_status === step.key;

          return (

            <div
              key={step.key}
              className="flex items-start gap-4"
            >

              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center
                ${
                  completed
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                <Icon size={18} />
              </div>

              <div className="flex-1">

                <div className="flex items-center gap-2">

                  <h3 className="font-semibold">
                    {step.title}
                  </h3>

                  {current && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      IN PROGRESS
                    </span>
                  )}

                </div>

                <p className="text-gray-500 text-sm">
                  {step.description}
                </p>

              </div>

              <div className="text-xs text-gray-400">

                {history &&
                  new Date(
                    history.updated_at
                  ).toLocaleString()}

              </div>

            </div>

          );
        })}

      </div>

    </div>
  );
}

export default OrderTrackingTimeline;