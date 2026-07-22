import { useEffect, useState } from "react";
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
    loadCart,
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

  const [placingOrder, setPlacingOrder] = useState(false);

  // Redirect only when user opens checkout with an empty cart
  useEffect(() => {
    if (
      !placingOrder &&
      cart.length === 0 &&
      window.location.pathname === "/checkout"
    ) {
      navigate("/cart", { replace: true });
    }
  }, [cart, placingOrder, navigate]);

  const handlePlaceOrder = async () => {
    try {
      if (
        !address.fullName ||
        !address.mobile ||
        !address.houseNo ||
        !address.street ||
        !address.village ||
        !address.city ||
        !address.district ||
        !address.state ||
        !address.pincode
      ) {
        alert("Please fill all required address fields.");
        return;
      }

      setPlacingOrder(true);

      const orderData = {
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
      };

      const response = await placeOrder(orderData);

      console.log("Order Response:", response);

      // Navigate first
      navigate("/order-success", {
        state: {
          order: response,
        },
        replace: true,
      });

      // Then clear backend cart
      await clearCart();

      await loadCart();

    } catch (err) {

      console.error(err);

      console.log(err.response);

      console.log(err.response?.data);

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
              placingOrder={placingOrder}
            />

          </div>

        </div>

      </div>

      <Footer />

    </div>
  );
}

export default Checkout;