"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useRegister } from "@/context/RegisterContext";

export default function RegisterStep1() {
  const router = useRouter();
  const { step1Data, setStep1Data } = useRegister();

  const [form, setForm] = useState({
    username: step1Data?.username || "",
    email: step1Data?.email || "",
    password: step1Data?.password || "",
    confirmPassword: step1Data?.password || "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Track visibility for password fields
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Simple email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Strong password: at least 8 chars, one uppercase, one lowercase, one number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!form.username.trim()) newErrors.username = "Username is required";
    if (!emailRegex.test(form.email)) newErrors.email = "Must be a valid email format";
    if (!passwordRegex.test(form.password))
      newErrors.password =
        "Password must be 8+ chars, include uppercase, lowercase, and number";
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords must match";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      Object.values(newErrors).forEach((msg) => toast.error(msg));
      return false;
    }
    return true;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
  
    setStep1Data({
      username: form.username,
      email: form.email,
      password: form.password,
    });
  
    router.push("/register/step2");
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
          <h2 className="text-2xl font-semibold text-center text-gray-800">
            Step 1: Account Creation
          </h2>

          <form onSubmit={handleNext} noValidate className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="border border-gray-300 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                required
              />
              {errors.username && (
                <p className="text-red-600 text-sm mt-1">{errors.username}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="border border-gray-300 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                required
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password input with toggle */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="border border-gray-300 rounded-lg w-full p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-9 right-3 text-gray-600 hover:text-gray-900 focus:outline-none cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
              {errors.password && (
                <p className="text-red-600 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                className="border border-gray-300 rounded-lg w-full p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-9 right-3 text-gray-600 hover:text-gray-900 focus:outline-none cursor-pointer"
                tabIndex={-1}
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
              {errors.confirmPassword && (
                <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition duration-200 mt-2 cursor-pointer"
            >
              Next
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
