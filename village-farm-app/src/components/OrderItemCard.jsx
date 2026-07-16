function OrderItemCard({ item }) {
  return (
    <div className="bg-gray-50 border rounded-2xl p-5">

      <div className="flex flex-col md:flex-row gap-6 items-center">

        {/* Product Image */}

        <div className="w-28 h-28">

          <img
            src={`/images/products/${item.product.product_image}`}
            alt={item.product.product_name}
            className="w-full h-full object-cover rounded-xl"
            onError={(e) => {
              e.target.src = "/images/no-image.png";
            }}
          />

        </div>

        {/* Product Details */}

        <div className="flex-1">

          <h2 className="text-xl font-bold text-gray-800">
            {item.product.product_name}
          </h2>

          <p className="text-gray-500 mt-2">
            {item.product.description}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">

            <div>

              <p className="text-gray-500 text-sm">
                Price
              </p>

              <h3 className="font-semibold">
                ₹{item.price}
              </h3>

            </div>

            <div>

              <p className="text-gray-500 text-sm">
                Quantity
              </p>

              <h3 className="font-semibold">
                {item.quantity}
              </h3>

            </div>

            <div>

              <p className="text-gray-500 text-sm">
                Unit
              </p>

              <h3 className="font-semibold">
                {item.product.unit}
              </h3>

            </div>

            <div>

              <p className="text-gray-500 text-sm">
                Total
              </p>

              <h3 className="text-green-700 font-bold">
                ₹{item.total}
              </h3>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default OrderItemCard;