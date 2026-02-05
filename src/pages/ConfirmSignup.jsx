import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { confirmSignUp } from "aws-amplify/auth";

export default function ConfirmSignup() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const handleConfirm = async () => {
    if (!code) return;

    try {
      setLoading(true);

      await confirmSignUp({
        username: email,
        confirmationCode: code,
      });

      alert("Account verified! Please login.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-subtle flex items-center justify-center px-4">
      {/* Card */}
      <div className="w-full max-w-md bg-surface border border-border rounded-2xl shadow-xl p-8 space-y-6">
        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-ink">
            Verify your account
          </h1>
          <p className="text-sm text-muted">Enter the OTP sent to your email</p>
        </div>

        {/* Email display */}
        {email && (
          <div className="text-xs text-center text-muted bg-subtle rounded-lg py-2 px-3">
            {email}
          </div>
        )}

        {/* OTP Input */}
        <div className="space-y-2">
          <input
            placeholder="Enter verification code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full rounded-xl border border-border px-4 py-3
            bg-white text-ink placeholder-muted
            focus:outline-none focus:ring-2 focus:ring-accent/20
            transition hover:shadow-md"
          />
        </div>

        {/* Button */}
        <button
          onClick={handleConfirm}
          disabled={loading}
          className="w-full rounded-xl bg-black text-white py-3 font-medium
          transition hover:opacity-90 hover:shadow-md
          disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Verifying..." : "Verify Account"}
        </button>

        {/* Back to login */}
        <div className="text-center text-sm text-muted">
          Already verified?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-accent hover:underline"
          >
            Go to login
          </button>
        </div>
      </div>
    </div>
  );
}
