function AddressCard({
  address,
  onEdit,
  onDelete,
  onDefault,
  selected,
  onSelect,
}) {
  return (
    <div
      onClick={() => onSelect(address)}
      className={`rounded-xl border p-5 cursor-pointer transition-all ${
        selected
          ? "border-green-600 bg-green-50 shadow-md"
          : "border-gray-300 hover:border-green-400 hover:shadow"
      }`}
    >
      <div className="flex justify-between items-start">

        <div className="space-y-1">

          <div className="flex items-center gap-3">

            <h3 className="text-xl font-bold">
              {address.full_name}
            </h3>

            {address.is_default && (
              <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full">
                Default
              </span>
            )}

          </div>

          <p>{address.mobile_number}</p>

          <p>{address.door_street}</p>

          <p>
            {address.village}, {address.district}
          </p>

          <p>
            {address.state} - {address.pincode}
          </p>

          {address.landmark && (
            <p className="text-gray-600">
              📍 {address.landmark}
            </p>
          )}

        </div>

      </div>

      <div className="flex gap-3 mt-5">

        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(address);
          }}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
        >
          ✏ Edit
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(address.id);
          }}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
        >
          🗑 Delete
        </button>

        {!address.is_default && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDefault(address.id);
            }}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
          >
            ⭐ Make Default
          </button>
        )}

      </div>

    </div>
  );
}

export default AddressCard;