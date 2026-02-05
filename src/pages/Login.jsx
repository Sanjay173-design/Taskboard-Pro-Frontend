import { useState } from "react";
import { signIn } from "aws-amplify/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Enter email and password");
      return;
    }

    try {
      setLoading(true);

      await signIn({
        username: email,
        password,
      });

      toast.success("Welcome back 🚀");

      navigate("/app/dashboard");
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-neutral-950 text-white text-white dark:text-whitetext-white">
      {/* 🌌 Premium Gradient Background */}
      <div className="absolute inset-0">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/20 blur-[120px]" />
      </div>

      {/* Center Container */}
      <div className="relative min-h-screen flex items-center justify-center px-6">
        {/* Glass Card */}
        <div className="w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-10 space-y-8">
          {/* Logo / Title */}
          <div className="space-y-2 text-left">
            <h1 className="text-3xl font-semibold tracking-tight">
              Taskboard Pro
            </h1>
            <p className="text-sm text-white text-white dark:text-whitetext-white/60">
              Professional task management for modern teams
            </p>
          </div>

          {/* Inputs */}
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3
              placeholder:text-white text-white dark:text-whitetext-white/40
              focus:outline-none focus:border-white/30 focus:bg-white/10 transition"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3
              placeholder:text-white text-white dark:text-whitetext-white/40
              focus:outline-none focus:border-white/30 focus:bg-white/10 transition"
            />
          </div>

          {/* Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-white text-black font-medium
            hover:scale-[1.02] active:scale-[0.99] transition-all duration-200"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          {/* Footer */}
          <p className="text-center text-sm text-white text-white dark:text-whitetext-white/50">
            New here?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-white text-white dark:text-whitetext-white font-medium cursor-pointer hover:underline"
            >
              Create account
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
