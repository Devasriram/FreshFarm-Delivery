function CancelOrderModal({
  open,
  onClose,
  onConfirm,
  loading,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">

        <h2 className="text-2xl font-bold text-red-600">
          Cancel Order
        </h2>

        <p className="text-gray-600 mt-3">
          Are you sure you want to cancel this order?
        </p>

        <p className="text-sm text-gray-500 mt-2">
          This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3 mt-8">

          <button
            onClick={onClose}
            className="px-5 py-2 border rounded-lg"
          >
            No
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg disabled:opacity-50"
          >
            {loading
              ? "Cancelling..."
              : "Yes, Cancel"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default CancelOrderModal;