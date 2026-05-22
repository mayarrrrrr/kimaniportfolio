import { useState } from "react";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      setToken(data.token);
    } else {
      alert("Login failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-black text-white">
      <form onSubmit={handleLogin} className="space-y-4 p-6 border rounded-xl">
        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 bg-transparent border w-full"
        />

        <input
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 bg-transparent border w-full"
        />

        <button className="bg-orange-500 px-4 py-2 w-full">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;