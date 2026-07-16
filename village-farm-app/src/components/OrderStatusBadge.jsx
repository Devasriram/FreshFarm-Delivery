function OrderStatusBadge({ status, type }) {

  let bgColor = "";
  let textColor = "";

  // Order Status
  if (type === "order") {

    switch (status?.toLowerCase()) {

      case "placed":
        bgColor = "bg-blue-100";
        textColor = "text-blue-700";
        break;

      case "processing":
        bgColor = "bg-yellow-100";
        textColor = "text-yellow-700";
        break;

      case "packed":
        bgColor = "bg-purple-100";
        textColor = "text-purple-700";
        break;

      case "shipped":
        bgColor = "bg-indigo-100";
        textColor = "text-indigo-700";
        break;

      case "out for delivery":
        bgColor = "bg-orange-100";
        textColor = "text-orange-700";
        break;

      case "delivered":
        bgColor = "bg-green-100";
        textColor = "text-green-700";
        break;

      case "cancelled":
        bgColor = "bg-red-100";
        textColor = "text-red-700";
        break;

      default:
        bgColor = "bg-gray-100";
        textColor = "text-gray-700";
    }

  }

  // Payment Status
  if (type === "payment") {

    switch (status?.toLowerCase()) {

      case "paid":
        bgColor = "bg-green-100";
        textColor = "text-green-700";
        break;

      case "pending":
        bgColor = "bg-yellow-100";
        textColor = "text-yellow-700";
        break;

      case "failed":
        bgColor = "bg-red-100";
        textColor = "text-red-700";
        break;

      default:
        bgColor = "bg-gray-100";
        textColor = "text-gray-700";
    }

  }

  return (

    <span
      className={`${bgColor} ${textColor} px-3 py-1 rounded-full text-sm font-semibold`}
    >
      {status}
    </span>

  );

}

export default OrderStatusBadge;