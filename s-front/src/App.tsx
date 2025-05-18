// src/App.tsx
import { useEffect, useState } from "react";
import AuthForm from "./components/AuthForm";
import Chat from "./components/Chat"; // assuming you have this

export default function App() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (stored) setToken(stored);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {token ? <Chat token={token} /> : <AuthForm onAuthSuccess={setToken} />}
    </div>
  );
}
