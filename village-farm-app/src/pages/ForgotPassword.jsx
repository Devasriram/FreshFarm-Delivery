import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, KeyRound, CheckCircle2 } from "lucide-react";
import Navbar from "../components/Navbar";

function ForgotPassword() {
  const [mobile, setMobile] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mobile.trim().length >= 10) {
      setSubmitted(true);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-green-100 flex justify-center items-center px-4 py-8">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 border border-green-200">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center">
              <KeyRound size={28} />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center text-green-800">
            Forgot Password
          </h2>
          <p className="text-center text-gray-500 text-sm mt-1 mb-6">
            Enter your registered mobile number to receive password reset OTP.
          </p>

          {submitted ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                <CheckCircle2 size={36} className="text-green-600 mx-auto mb-2" />
                <p className="font-semibold text-green-800 text-sm">
                  OTP Sent Successfully!
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  We have sent a verification code to <span className="font-bold">{mobile}</span>. For demo, your password can also be reset by admin.
                </p>
              </div>

              <Link
                to="/"
                className="block text-center bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-xl transition"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Registered Mobile Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. 9876543210"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-xl shadow-md transition"
              >
                Send Reset OTP
              </button>

              <div className="text-center pt-2">
                <Link
                  to="/"
                  className="inline-flex items-center gap-1.5 text-sm text-green-700 hover:underline font-medium"
                >
                  <ArrowLeft size={16} />
                  <span>Back to Login</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
