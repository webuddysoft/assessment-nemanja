"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, User } from "@/context/AuthContext";
import API from "@/api/api";
import { getAuthHeader } from "@/utils/auth";
import { formatDate } from "@/utils/date";
import { toast } from "react-toastify";

const initialFormValues = {
  username: "",
  email: "",
  nickname: "",
  about_me: "",
  gender: "",
  birthdate: "",
  favorites: [] as string[],
  createdAt: "",
};

const genders = ["Male", "Female", "Other"];

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [form, setForm] = useState<User>(user || { initialFormValues });
  const [favoritesList, setFavoritesList] = useState<string[]>([]);
  const router = useRouter();

  // Load favorites JSON
  useEffect(() => {
    fetch("/data/favorites.json")
      .then((res) => res.json())
      .then(setFavoritesList)
      .catch(() => setFavoritesList([]));
  }, []);

  useEffect(() => {
    if(user) {
        setForm({
            ...user,
            favorites: Array.isArray(user.favorites)
              ? user.favorites
              : typeof user.favorites === "string"
              ? user.favorites.split(",").map((f) => f.trim())
              : [],
          });
    }
  }, [user])

  const toggleFavorite = (fav: string) => {
    setForm((prevForm) => {
      const currentFavorites = prevForm.favorites ?? [];
      const isSelected = currentFavorites.includes(fav);
      const updatedFavorites = isSelected
        ? currentFavorites.filter((f) => f !== fav)
        : [...currentFavorites, fav];
  
      return { ...prevForm, favorites: updatedFavorites };
    });
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        ...form,
        favorites: Array.isArray(form.favorites) ? form.favorites.join(", ") : form.favorites,
      };
      await API.put(`/users/${user?.id}`, payload, getAuthHeader());
      toast.success("User data updated!");
    } catch (e) {
      console.error(e);
    
      toast.error(`User data update failed. ${e?.response.data.detail || ''}`);
    }
  };
  
  const handleDelete = async () => {
    try {
      await API.delete(`/users/${user?.id}`, getAuthHeader());
      toast.success("Account deleted");
      logout();
      router.push("/login");
    } catch (e) {
      console.error(e.message) // This returns Network error 500
      toast.error("Failed to delete account");
    }
  };
  
  const handleLogout = async () => {
    try {
      await API.post("/auth/logout", {}, getAuthHeader());
      logout();
      router.push("/login");
      toast.success("Logged out successfully");
    } catch {
      toast.error("Logout failed");
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Profile
        </h2>

        <input
          className="border border-gray-300 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          placeholder="Username"
          value={form.username ?? ""}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          className="border border-gray-300 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          placeholder="Email"
          value={form.email ?? ""}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="border border-gray-300 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          placeholder="Nickname"
          value={form.nickname ?? ""}
          onChange={(e) => setForm({ ...form, nickname: e.target.value })}
        />
        <textarea
          className="border border-gray-300 rounded-lg w-full p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          placeholder="About Me"
          value={form.about_me ?? ""}
          onChange={(e) => setForm({ ...form, about_me: e.target.value })}
        />
        <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">
            Gender
        </label>
        <div className="relative">
            <select
            value={form.gender ?? ""}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
            className="appearance-none border border-gray-300 rounded-lg w-full p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 cursor-pointer shadow-sm transition duration-150"
            >
            <option value="">Select gender</option>
            {genders.map((g) => (
                <option key={g} value={g}>
                {g}
                </option>
            ))}
            </select>
            <div className="pointer-events-none absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500">
            ▼
            </div>
        </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">
            Birthdate
          </label>
          <input
            type="date"
            value={form.birthdate ?? ""}
            onChange={(e) => setForm({ ...form, birthdate: e.target.value })}
            className="border border-gray-300 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
        </div>

        <div>
            <fieldset>
                <legend className="text-sm font-medium text-gray-700 mb-2">Favorites</legend>
                <div className="flex flex-wrap gap-2">
                    {favoritesList.map((fav) => {
                    const selected = form.favorites?.includes(fav);
                    return (
                        <button
                        type="button"
                        key={fav}
                        onClick={() => toggleFavorite(fav)}
                        className={`cursor-pointer px-3 py-1 rounded-full text-sm border transition-all duration-150 ${
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
        </div>
       
        <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
                Created at
            </label>
            <input
            className="border border-gray-200 bg-gray-100 text-gray-700 rounded-lg w-full p-3 cursor-not-allowed"
            placeholder="Created At"
            value={formatDate(form.created_at as string) ?? ""}
            readOnly
            />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
                onClick={handleUpdate}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition duration-200 cursor-pointer"
            >
                Update Profile
            </button>
            <button
                onClick={handleDelete}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 rounded-lg transition duration-200 cursor-pointer"
            >
                Delete Account
            </button>
            <button
                onClick={handleLogout}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 rounded-lg transition duration-200 cursor-pointer"
            >
                Logout
            </button>
        </div>
      </div>
    </div>
  );
}
