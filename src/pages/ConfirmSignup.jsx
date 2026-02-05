import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { confirmSignUp } from "aws-amplify/auth";

export default function ConfirmSignup() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Email passed from register page
  const email = location.state?.email;

  const handleConfirm = async () => {
    try {
      await confirmSignUp({
        username: email,
        confirmationCode: code,
      });

      alert("Account verified! Please login.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow w-96">
        <h2 className="text-xl font-semibold mb-4">Verify Account</h2>

        <input
          placeholder="Enter OTP"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
        />

        <button
          onClick={handleConfirm}
          className="w-full bg-black text-white py-2 rounded"
        >
          Verify
        </button>
      </div>
    </div>
  );
}
