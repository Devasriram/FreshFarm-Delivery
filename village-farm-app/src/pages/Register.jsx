import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import InputField from "../components/InputField";
import Button from "../components/Button";

import { registerCustomer } from "../services/authService";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    mobile_number: "",
    email: "",
    village: "",
    password: "",
    confirm_password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.full_name ||
      !formData.mobile_number ||
      !formData.email ||
      !formData.village ||
      !formData.password ||
      !formData.confirm_password
    ) {
      setError("Please fill all fields.");
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.mobile_number)) {
      setError("Mobile number must contain exactly 10 digits.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password should be at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await registerCustomer({
        full_name: formData.full_name,
        mobile_number: formData.mobile_number,
        email: formData.email,
        village: formData.village,
        password: formData.password,
      });

      setSuccess("Registration Successful!");

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
  console.log("Backend Error:", err.response?.data);

  if (Array.isArray(err.response?.data?.detail)) {
    setError(err.response.data.detail[0].msg);
  } else {
    setError(
      err.response?.data?.detail ||
      err.message ||
      "Registration failed."
    );
  }
} finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-green-100 flex justify-center items-center px-4 py-6">
        <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">

          <h2 className="text-2xl font-bold text-center text-green-700 mb-2">
            Customer Registration
          </h2>

          <p className="text-center text-gray-500 mb-6">
            Create your Farm Fresh account
          </p>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <InputField
              name="full_name"
              placeholder="Full Name"
              value={formData.full_name}
              onChange={handleChange}
              required
            />

            <InputField
              name="mobile_number"
              placeholder="Mobile Number"
              value={formData.mobile_number}
              onChange={handleChange}
              required
            />

            <InputField
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <InputField
              name="village"
              placeholder="Village / Location"
              value={formData.village}
              onChange={handleChange}
              required
            />

            <InputField
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <InputField
              type="password"
              name="confirm_password"
              placeholder="Confirm Password"
              value={formData.confirm_password}
              onChange={handleChange}
              required
            />

            <Button
              type="submit"
              text={loading ? "Registering..." : "Register"}
              disabled={loading}
            />

          </form>

          <p className="text-center mt-6">
            Already have an account?

            <Link
              to="/"
              className="text-green-700 font-semibold ml-2"
            >
              Login
            </Link>
          </p>

        </div>
      </div>
    </>
  );
}

export default Register;