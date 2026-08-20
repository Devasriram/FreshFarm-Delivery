import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { KeyRound, Smartphone, ShieldCheck, ArrowRight, RefreshCw, Edit3 } from "lucide-react";

import Navbar from "../components/Navbar";
import InputField from "../components/InputField";
import Button from "../components/Button";

import { loginCustomer, sendCustomerOtp, verifyCustomerOtp } from "../services/authService";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // Tab: "password" or "otp"
  const [loginMethod, setLoginMethod] = useState("password");

  // Password Login Form
  const [passwordForm, setPasswordForm] = useState({
    mobile_number: "",
    password: "",
  });

  // OTP Login Form
  const [otpMobile, setOtpMobile] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [demoOtpHint, setDemoOtpHint] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  // Password-based submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!passwordForm.mobile_number || !passwordForm.password) {
      setError("Please enter Mobile Number and Password.");
      return;
    }

    try {
      setLoading(true);
      const response = await loginCustomer(passwordForm);
      login(response.data.access_token, response.data.customer);
      navigate("/home");
    } catch (err) {
      setError(
        err.response?.data?.detail || "Invalid Mobile Number or Password"
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setError("");
    setSuccess("");

    const cleanedMobile = otpMobile.trim();
    if (!cleanedMobile || cleanedMobile.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      setLoading(true);
      const res = await sendCustomerOtp(cleanedMobile);
      setOtpSent(true);
      setResendTimer(60);
      setSuccess(`OTP sent successfully to +91 ${cleanedMobile}`);
      if (res.data?.otp) {
        setDemoOtpHint(res.data.otp);
      }
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    const cleanedOtp = otpCode.trim();
    if (!cleanedOtp || cleanedOtp.length < 4) {
      setError("Please enter the OTP code received.");
      return;
    }

    try {
      setLoading(true);
      const res = await verifyCustomerOtp(otpMobile.trim(), cleanedOtp);
      login(res.data.access_token, res.data.customer);
      navigate("/home");
    } catch (err) {
      setError(
        err.response?.data?.detail || "Invalid OTP code. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-green-100 flex justify-center items-center px-4 py-8">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 sm:p-8 border border-green-200">

          {/* Heading */}
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-green-800">
              Customer Login
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Choose your preferred login method
            </p>
          </div>

          {/* Login Method Tabs */}
          <div className="grid grid-cols-2 p-1 bg-green-50 rounded-xl mb-6 border border-green-200/80">
            <button
              type="button"
              onClick={() => {
                setLoginMethod("password");
                setError("");
                setSuccess("");
              }}
              className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition ${
                loginMethod === "password"
                  ? "bg-green-700 text-white shadow-sm"
                  : "text-gray-600 hover:text-green-800"
              }`}
            >
              <KeyRound size={15} />
              <span>Password Login</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setLoginMethod("otp");
                setError("");
                setSuccess("");
              }}
              className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition ${
                loginMethod === "otp"
                  ? "bg-green-700 text-white shadow-sm"
                  : "text-gray-600 hover:text-green-800"
              }`}
            >
              <Smartphone size={15} />
              <span>Mobile OTP Login</span>
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm p-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-800 text-xs sm:text-sm p-3 rounded-xl mb-4">
              {success}
            </div>
          )}

          {/* ================= PASSWORD LOGIN TAB ================= */}
          {loginMethod === "password" && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <InputField
                name="mobile_number"
                placeholder="10-digit Mobile Number"
                value={passwordForm.mobile_number}
                onChange={handlePasswordChange}
                required
              />

              <InputField
                type="password"
                name="password"
                placeholder="Password"
                value={passwordForm.password}
                onChange={handlePasswordChange}
                required
              />

              <Button
                type="submit"
                text={loading ? "Logging In..." : "Login with Password"}
                disabled={loading}
              />
            </form>
          )}

          {/* ================= OTP LOGIN TAB ================= */}
          {loginMethod === "otp" && (
            <div>
              {!otpSent ? (
                // Step 1: Enter Mobile Number & Request OTP
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Registered Mobile Number
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={otpMobile}
                      onChange={(e) => {
                        setOtpMobile(e.target.value);
                        setError("");
                      }}
                      required
                      maxLength={10}
                      className="w-full bg-slate-50 border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 font-medium"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otpMobile.length < 10}
                    className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3 rounded-xl text-sm transition shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      "Sending OTP..."
                    ) : (
                      <>
                        <span>Send Login OTP</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                // Step 2: Enter OTP & Verify
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 flex items-center justify-between">
                    <div>
                      <span>Sent OTP to <strong>+91 {otpMobile}</strong></span>
                      {demoOtpHint && (
                        <div className="text-[11px] text-emerald-700 mt-0.5">
                          Demo OTP: <span className="font-mono font-bold bg-emerald-100 px-1.5 py-0.5 rounded">{demoOtpHint}</span> (or 123456)
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setOtpCode("");
                        setError("");
                        setSuccess("");
                      }}
                      className="text-emerald-700 hover:underline font-bold flex items-center gap-1 text-[11px]"
                    >
                      <Edit3 size={12} />
                      <span>Change</span>
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Enter 6-Digit OTP
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 123456"
                      value={otpCode}
                      onChange={(e) => {
                        setOtpCode(e.target.value);
                        setError("");
                      }}
                      maxLength={6}
                      required
                      autoFocus
                      className="w-full bg-slate-50 border border-gray-300 rounded-xl p-3 text-center text-xl tracking-widest font-mono font-bold focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otpCode.length < 4}
                    className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3 rounded-xl text-sm transition shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      "Verifying..."
                    ) : (
                      <>
                        <ShieldCheck size={18} />
                        <span>Verify & Login</span>
                      </>
                    )}
                  </button>

                  <div className="text-center pt-1">
                    {resendTimer > 0 ? (
                      <span className="text-xs text-gray-500">
                        Resend OTP in <strong className="text-green-800">{resendTimer}s</strong>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSendOtp(null)}
                        disabled={loading}
                        className="text-xs text-green-700 font-bold hover:underline inline-flex items-center gap-1"
                      >
                        <RefreshCw size={12} />
                        <span>Resend OTP</span>
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Links */}
          <div className="text-center mt-5 space-y-2 text-xs sm:text-sm">
            <div>
              <Link
                to="/forgot-password"
                className="text-blue-600 hover:underline font-medium"
              >
                Forgot Password?
              </Link>
            </div>

            <div className="text-gray-600">
              Don't have an account?
              <Link
                to="/register"
                className="text-green-700 font-bold ml-1.5 hover:underline"
              >
                Register
              </Link>
            </div>
          </div>

          {/* Portal Switcher Footers */}
          <div className="mt-6 pt-5 border-t border-gray-200 flex justify-between items-center text-xs">
            <Link
              to="/admin/login"
              className="font-bold text-slate-800 hover:text-green-700 transition"
            >
              🛡️ Admin Login
            </Link>
            <Link
              to="/delivery/login"
              className="font-bold text-emerald-700 hover:text-emerald-800 transition"
            >
              🚚 Delivery Partner Login →
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}

export default Login;