import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import InputField from "../components/InputField";
import Button from "../components/Button";

import { loginCustomer } from "../services/authService";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    mobile_number: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

    if (!formData.mobile_number || !formData.password) {
      setError("Please enter Mobile Number and Password.");
      return;
    }

    try {
  setLoading(true);

  const response = await loginCustomer(formData);

  login(
    response.data.access_token,
    response.data.customer
  );

  navigate("/home");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Invalid Mobile Number or Password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-green-100 flex justify-center items-center px-4">
        <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">

          <h2 className="text-2xl font-bold text-center text-green-700 mb-2">
            Customer Login
          </h2>

          <p className="text-center text-gray-500 mb-6">
            Login to continue
          </p>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <InputField
              name="mobile_number"
              placeholder="Mobile Number"
              value={formData.mobile_number}
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

            <Button
              type="submit"
              text={loading ? "Logging In..." : "Login"}
              disabled={loading}
            />

          </form>

          <div className="text-center mt-4">
            <Link
              to="/forgot-password"
              className="text-blue-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <div className="text-center mt-4">
            Don't have an account?

            <Link
              to="/register"
              className="text-green-700 font-semibold ml-2"
            >
              Register
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}

export default Login;