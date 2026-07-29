import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import AddressCard from "../components/AddressCard";
import AddressForm from "../components/AddressForm";
import OrderSummary from "../components/OrderSummary";
import PaymentSummary from "../components/PaymentSummary";

import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../services/addressService";

import { placeOrder } from "../services/orderService";
import { useCart } from "../context/CartContext";

function Checkout() {
  const navigate = useNavigate();

  const { cart, clearCart, loadCart } = useCart();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    loadAddresses();
  }, []);

  // Redirect only if the user enters checkout with an empty cart.
  useEffect(() => {
    if (!placingOrder && cart.length === 0) {
      navigate("/cart", { replace: true });
    }
  }, [cart, placingOrder, navigate]);

  const loadAddresses = async () => {
    try {
      const data = await getAddresses();

      setAddresses(data);

      const defaultAddress =
        data.find((a) => a.is_default) || data[0];

      setSelectedAddress(defaultAddress);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveAddress = async (form) => {
    try {
      if (editingAddress) {
        await updateAddress(editingAddress.id, form);
      } else {
        await addAddress(form);
      }

      setShowForm(false);
      setEditingAddress(null);

      loadAddresses();
    } catch (err) {
      alert(err.response?.data?.detail || "Unable to save address.");
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm("Delete this address?")) return;

    try {
      await deleteAddress(id);
      loadAddresses();
    } catch (err) {
      alert(err.response?.data?.detail || "Unable to delete address.");
    }
  };

  const handleDefault = async (id) => {
    try {
      await setDefaultAddress(id);
      loadAddresses();
    } catch (err) {
      alert(err.response?.data?.detail || "Unable to update default address.");
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert("Please select a delivery address.");
      return;
    }

    try {
      setPlacingOrder(true);

      const orderData = {
        full_name: selectedAddress.full_name,
        mobile_number: selectedAddress.mobile_number,
        door_street: selectedAddress.door_street,
        village: selectedAddress.village,
        district: selectedAddress.district,
        state: selectedAddress.state,
        pincode: selectedAddress.pincode,
        landmark: selectedAddress.landmark,
        payment_method: paymentMethod,
      };

      const response = await placeOrder(orderData);

      // Go to success page immediately
      navigate("/order-success", {
        replace: true,
        state: {
          order: response,
        },
      });

      // Clear cart afterwards
      clearCart();
      loadCart();

    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.detail ||
        "Unable to place order."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50">
      <Header />

      <div className="max-w-7xl mx-auto py-10 px-6">
        <h1 className="text-3xl font-bold mb-8">
          Checkout
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-6">

            <div className="bg-white rounded-xl p-6 shadow">

              <div className="flex justify-between mb-5">

                <h2 className="text-xl font-semibold">
                  Delivery Address
                </h2>

                <button
                  onClick={() => {
                    setEditingAddress(null);
                    setShowForm(true);
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  + Add Address
                </button>

              </div>

              {addresses.map((item) => (
                <AddressCard
                  key={item.id}
                  address={item}
                  selected={selectedAddress?.id === item.id}
                  onSelect={setSelectedAddress}
                  onEdit={(a) => {
                    setEditingAddress(a);
                    setShowForm(true);
                  }}
                  onDelete={handleDeleteAddress}
                  onDefault={handleDefault}
                />
              ))}

            </div>

            {showForm && (
              <AddressForm
                initialData={editingAddress}
                onSubmit={handleSaveAddress}
                onCancel={() => {
                  setShowForm(false);
                  setEditingAddress(null);
                }}
              />
            )}

            <PaymentSummary
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
            />

          </div>

          <OrderSummary
            handlePlaceOrder={handlePlaceOrder}
            placingOrder={placingOrder}
          />

        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Checkout;