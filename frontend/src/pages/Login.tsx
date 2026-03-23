import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useAuth";
import gsap from "gsap";

const Login = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement|null>(null);
  const [authId, setAuthId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [focusedField, setFocusedField] = useState<
    "authId" | "password" | null
  >(null);

  const { mutate: login, isPending, error: loginError } = useLogin();

  const handleClick = () => {
    setSubmitted(true);

    if (!authId || !password) return;

    login(
      { authId, password },
      {
        onSuccess: async () => {
          await gsap.to(containerRef.current, {
            opacity: 0,
            duration: 0.5,
            ease: "power2.inOut",
          });

          navigate("/", { replace: true });
        },
      },
    );
  };
  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full bg-[#0A0F1C] flex justify-center items-center py-5"
    >
      <div className="border border-blue-500 w-full max-w-sm p-8 bg-[#050723] rounded-2xl flex flex-col gap-6">
        <h2 className="text-blue-400 text-2xl font-semibold text-center">
          Login
        </h2>

        <div className="relative">
          <input
            type="text"
            value={authId}
            onChange={(e) => setAuthId(e.target.value)}
            onFocus={() => setFocusedField("authId")}
            onBlur={() => setFocusedField(null)}
            className={`w-full p-3 bg-transparent text-white focus:outline-none border-b ${
              submitted && !authId
                ? "border-red-500"
                : "border-gray-600 focus:border-blue-400"
            }`}
          />
          <label
            className={`absolute left-0 transition-all ${
              authId || focusedField === "authId"
                ? "text-blue-400 -top-6 text-sm"
                : "text-gray-400 top-3"
            }`}
          >
            Roll ID
          </label>
        </div>

        <div className="relative">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setFocusedField("password")}
            onBlur={() => setFocusedField(null)}
            className={`w-full p-3 bg-transparent text-white focus:outline-none border-b ${
              submitted && !password
                ? "border-red-500"
                : "border-gray-600 focus:border-blue-400"
            }`}
          />
          <label
            className={`absolute left-0 transition-all ${
              password || focusedField === "password"
                ? "text-blue-400 -top-6 text-sm"
                : "text-gray-400 top-3"
            }`}
          >
            Password
          </label>
        </div>

        {loginError && (
          <p className="text-red-500 text-sm text-center">
            {loginError.message || "Login failed"}
          </p>
        )}

        <button
          onClick={handleClick}
          disabled={isPending}
          className="bg-slate-400 text-black font-semibold py-2 rounded-md hover:bg-slate-500 disabled:opacity-50 transition-all"
        >
          {isPending ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
};

export default Login;
