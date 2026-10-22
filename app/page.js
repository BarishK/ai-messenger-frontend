"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function HomePage() {
  const router = useRouter();
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchPersonas = async () => {
      try {
        const res = await api.get("/personas");
        setPersonas(res.data);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
        } else {
          setError("Karakterler yüklenirken bir hata oluştu.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPersonas();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-gray-400 animate-pulse">Karakterler yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-800">
          <div>
            <h1 className="text-2xl font-bold">AI Messenger</h1>
            <p className="text-sm text-gray-400">
              Sohbet etmek için bir karakter seçin
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded-lg text-sm font-medium transition"
          >
            Çıkış Yap
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {personas.map((persona) => (
            <div
              key={persona.id}
              onClick={() => router.push(`/chat/${persona.slug}`)}
              className="bg-gray-800 border border-gray-700 hover:border-blue-500 p-5 rounded-2xl cursor-pointer transition transform hover:-translate-y-1 shadow-lg flex items-center space-x-4"
            >
              <div className="w-12 h-12 bg-blue-600/20 text-blue-400 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">
                {persona.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-lg font-semibold">{persona.name}</h2>
                <p className="text-sm text-gray-400 line-clamp-2">
                  {"Sohbet etmeye hazır."}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
