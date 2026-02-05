import { useState } from "react";
import { signUp } from "aws-amplify/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await signUp({
        username: email,
        password,
        options: {
          userAttributes: { email },
        },
      });

      toast.success("Account created 🎉");
      navigate("/confirm", { state: { email } });
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-neutral-950 text-white dark:text-white">
      {/* Background glow */}
      <div className="absolute inset-0">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-pink-600/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/20 blur-[120px]" />
      </div>

      <div className="relative min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-10 space-y-8">
          <div className="space-y-2 text-left">
            <h1 className="text-3xl font-semibold tracking-tight">
              Taskboard Pro
            </h1>
            <p className="text-sm text-white dark:text-white/60">
              Start managing work like a pro
            </p>
          </div>

          <div className="space-y-4">
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3"
            />
          </div>

          <button
            onClick={handleRegister}
            className="w-full py-3 rounded-xl bg-white text-black font-medium hover:scale-[1.02] transition"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}
