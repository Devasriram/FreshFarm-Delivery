import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import AddressForm from "../components/AddressForm";
import OrderSummary from "../components/OrderSummary";
import PaymentSummary from "../components/PaymentSummary";

import { useCart } from "../context/CartContext";
import { placeOrder } from "../services/orderService";

function Checkout() {
  const navigate = useNavigate();

  const {
    cart,
    clearCart,
  } = useCart();

  const [address, setAddress] = useState({
    fullName: "",
    mobile: "",
    email: "",
    houseNo: "",
    street: "",
    village: "",
    city: "",
    district: "",
    state: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");

  if (cart.length === 0) {
    navigate("/cart");
    return null;
  }

  const handlePlaceOrder = async () => {
    try {
      const order = {
        full_name: address.fullName,
        mobile: address.mobile,
        email: address.email,

        house_no: address.houseNo,
        street: address.street,
        village: address.village,
        city: address.city,
        district: address.district,
        state: address.state,
        pincode: address.pincode,

        payment_method: paymentMethod,

        items: cart.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
      };

      const response = await placeOrder(order);

      clearCart();

      navigate("/order-success", {
        state: response,
      });
    } catch (err) {
      console.error(err);
      alert("Unable to place order.");
    }
  };

  return (
    <div className="min-h-screen bg-green-50">

      <Header />

      <div className="max-w-7xl mx-auto px-6 py-10">

        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Checkout
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-8">

            <AddressForm
              address={address}
              setAddress={setAddress}
            />

            <PaymentSummary
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
            />

          </div>

          <div>

            <OrderSummary
              handlePlaceOrder={handlePlaceOrder}
            />

          </div>

        </div>

      </div>

      <Footer />

    </div>
  );
}

export default Checkout;