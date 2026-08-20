import {
  ClipboardList,
  CheckCircle2,
  Package,
  Bike,
  Truck,
  Home,
  XCircle,
  Clock,
  UserCheck,
} from "lucide-react";

const STEPS = [
  {
    key: "Order Placed",
    aliases: ["Pending", "Order Placed"],
    title: "Order Placed",
    icon: ClipboardList,
    description: "Your order has been placed and received by the farm.",
  },
  {
    key: "Order Confirmed",
    aliases: ["Confirmed", "Order Confirmed", "Assigned"],
    title: "Order Confirmed",
    icon: CheckCircle2,
    description: "Order is confirmed and assigned for fulfillment.",
  },
  {
    key: "Preparing",
    aliases: ["Preparing", "Packing", "Packed"],
    title: "Preparing",
    icon: Package,
    description: "Fresh produce is being harvested, inspected, and packed.",
  },
  {
    key: "Picked Up",
    aliases: ["Picked Up", "Picked up"],
    title: "Picked Up",
    icon: Bike,
    description: "Delivery partner has picked up your fresh package.",
  },
  {
    key: "Out for Delivery",
    aliases: ["Out for Delivery", "On the Way"],
    title: "Out for Delivery",
    icon: Truck,
    description: "Delivery partner is on the way to your address.",
  },
  {
    key: "Delivered",
    aliases: ["Delivered"],
    title: "Delivered",
    icon: Home,
    description: "Order successfully delivered to your doorstep.",
  },
];

function OrderTrackingTimeline({ tracking }) {
  if (!tracking) return null;

  const currentStatus = tracking.current_status || "Pending";
  const isCancelled = currentStatus === "Cancelled";

  // Find active step index based on current status and aliases
  let currentIndex = STEPS.findIndex((step) =>
    step.aliases.some(
      (a) => a.toLowerCase() === currentStatus.toLowerCase()
    )
  );

  if (currentIndex === -1) {
    if (isCancelled) currentIndex = -1;
    else currentIndex = 0;
  }

  // Find history records matching steps
  const getHistoryForStep = (step) => {
    if (!tracking.history || tracking.history.length === 0) return null;
    return tracking.history.find((h) =>
      step.aliases.some(
        (a) =>
          a.toLowerCase() === (h.status || "").toLowerCase() ||
          (h.status || "").toLowerCase().includes(a.toLowerCase())
      )
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <span>Order Delivery Timeline</span>
            {!isCancelled && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                Live Tracking
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time status updates from farm harvest to doorstep delivery
          </p>
        </div>

        {tracking.estimated_delivery_time && !isCancelled && (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl text-emerald-900 text-xs font-semibold">
            <Clock size={15} className="text-emerald-600 shrink-0" />
            <div>
              <span className="text-slate-500 font-normal">Est. Delivery: </span>
              <strong>{tracking.estimated_delivery_time}</strong>
            </div>
          </div>
        )}
      </div>

      {/* Cancelled Notice */}
      {isCancelled ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center text-red-700 space-y-2">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto text-red-600">
            <XCircle size={28} />
          </div>
          <h3 className="font-bold text-lg text-red-900">Order Has Been Cancelled</h3>
          <p className="text-xs text-red-600 max-w-md mx-auto">
            This order was cancelled. Any applied charges or items have been refunded/restocked.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop / Tablet Stepper Bar */}
          <div className="hidden md:flex justify-between items-center mb-10 relative">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const completed = index < currentIndex || currentIndex === STEPS.length - 1;
              const current = index === currentIndex && currentIndex !== STEPS.length - 1;

              return (
                <div key={step.key} className="flex-1 flex flex-col items-center relative">
                  {/* Connecting Line */}
                  {index !== STEPS.length - 1 && (
                    <div
                      className={`absolute top-5 left-1/2 w-full h-1 transition-all duration-500 ${
                        index < currentIndex
                          ? "bg-emerald-600"
                          : "bg-slate-200"
                      }`}
                    />
                  )}

                  {/* Icon Node */}
                  <div
                    className={`relative z-10 w-11 h-11 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                      completed
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                        : current
                        ? "bg-white border-2 border-emerald-600 text-emerald-700 shadow-lg ring-4 ring-emerald-100"
                        : "bg-white border-2 border-slate-200 text-slate-400"
                    }`}
                  >
                    <Icon size={18} />
                  </div>

                  {/* Step Label */}
                  <span
                    className={`text-xs font-bold mt-3 text-center transition-colors ${
                      completed || current ? "text-slate-900" : "text-slate-400"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Detailed Vertical Timeline Cards */}
          <div className="space-y-4 pt-2">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const historyItem = getHistoryForStep(step);
              const completed = index < currentIndex || currentIndex === STEPS.length - 1;
              const current = index === currentIndex && currentIndex !== STEPS.length - 1;

              return (
                <div
                  key={step.key}
                  className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                    current
                      ? "bg-emerald-50/50 border-emerald-300 ring-1 ring-emerald-200"
                      : completed
                      ? "bg-white border-slate-200"
                      : "bg-slate-50/50 border-slate-100 opacity-60"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      completed
                        ? "bg-emerald-600 text-white"
                        : current
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-200 text-slate-400"
                    }`}
                  >
                    <Icon size={18} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h4
                          className={`text-sm font-bold ${
                            completed || current
                              ? "text-slate-900"
                              : "text-slate-500"
                          }`}
                        >
                          {step.title}
                        </h4>
                        {current && (
                          <span className="text-[10px] font-extrabold uppercase bg-emerald-600 text-white px-2 py-0.5 rounded-full tracking-wider animate-pulse">
                            Current Stage
                          </span>
                        )}
                        {completed && !current && (
                          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                            Completed
                          </span>
                        )}
                      </div>

                      {historyItem?.updated_at && (
                        <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                          <Clock size={12} className="text-slate-400" />
                          <span>{new Date(historyItem.updated_at).toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 mt-1">{step.description}</p>

                    {historyItem?.updated_by && (
                      <div className="mt-1.5 flex items-center gap-1 text-[11px] text-slate-600 font-semibold">
                        <UserCheck size={12} className="text-emerald-600" />
                        <span>Updated by: {historyItem.updated_by}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default OrderTrackingTimeline;