"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import API from "@/api/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRegister } from "@/context/RegisterContext";

const genders = ["Male", "Female", "Other"];

export default function RegisterStep2() {
  const router = useRouter();
  const { step1Data } = useRegister();

  const [favoritesList, setFavoritesList] = useState<string[]>([]);
  const [form, setForm] = useState({
    gender: "",
    birthdate: "",
    favorites: [] as string[],
    nickname: "",
    about_me: "",
  });

  useEffect(() => {
    if (!step1Data) {
      router.replace("/register/step1");
    }
  }, [step1Data, router]);

  // Load favorites JSON
  useEffect(() => {
    fetch("/data/favorites.json")
      .then((res) => res.json())
      .then(setFavoritesList)
      .catch(() => setFavoritesList([]));
  }, []);

  const toggleFavorite = (fav: string) => {
    setForm((prev) => {
      if (prev.favorites.includes(fav)) {
        return { ...prev, favorites: prev.favorites.filter((f) => f !== fav) };
      } else {
        return { ...prev, favorites: [...prev.favorites, fav] };
      }
    });
  };

  const handleRegister = async () => {
    if (!step1Data) return;

    const dataToSend = {
      username: step1Data.username,
      email: step1Data.email,
      password: step1Data.password,
      gender: form.gender || null,
      birthdate: form.birthdate || null,
      favorites: form.favorites.join(", "),
      nickname: form.nickname || null,
      about_me: form.about_me || null,
    };

    try {
      await API.post("/users/", dataToSend);
      toast.success("Registration successful!");
      sessionStorage.removeItem("registerStep1");
      setTimeout(() => router.push("/login"), 1500);
    } catch (e: any) {
      console.error(e);
      toast.error(`Registration failed. ${e?.response?.data?.detail || ''}`);
    }
  };

  if (!step1Data) return null;

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8 space-y-6">
          <button
            onClick={() => router.push("/register/step1")}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 cursor-pointer font-medium"
            aria-label="Go back to Step 1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Step 1
          </button>

          <h2 className="text-2xl font-semibold text-center text-gray-800">
            Step 2: Profile Details (Optional)
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
              className="border border-gray-300 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 cursor-pointer"
            >
              <option value="">Select gender</option>
              {genders.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Birthdate
            </label>
            <input
              type="date"
              value={form.birthdate}
              onChange={(e) => setForm({ ...form, birthdate: e.target.value })}
              className="border border-gray-300 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
          </div>

          <fieldset>
            <legend className="text-sm font-medium text-gray-700 mb-2">
              Favorites
            </legend>
            <div className="flex flex-wrap gap-2">
              {favoritesList.map((fav) => {
                const selected = form.favorites.includes(fav);
                return (
                  <button
                    type="button"
                    key={fav}
                    onClick={() => toggleFavorite(fav)}
                    className={`px-3 py-1 rounded-full text-sm border transition-all duration-150 cursor-pointer ${
                      selected
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {fav}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nickname
            </label>
            <input
              type="text"
              value={form.nickname}
              onChange={(e) => setForm({ ...form, nickname: e.target.value })}
              className="border border-gray-300 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              About Me
            </label>
            <textarea
              value={form.about_me}
              onChange={(e) => setForm({ ...form, about_me: e.target.value })}
              className="border border-gray-300 rounded-lg w-full p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
          </div>

          <button
            onClick={handleRegister}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition duration-200 cursor-pointer"
          >
            Register
          </button>
        </div>
      </div>
    </>
  );
}
