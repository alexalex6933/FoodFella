import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("user");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw new Error(error.message);
        if (!data.user) throw new Error("User not created.");

        const { data: existingUser, error: checkError } = await supabase
          .from("User")
          .select("*")
          .eq("id", data.user.id)
          .single();

        if (checkError && checkError.code !== "PGRST116") {
          console.error("Error checking existing user:", checkError.message);
          throw new Error(checkError.message);
        }

        if (!existingUser) {
          const { error: dbError } = await supabase.from("User").insert([
            {
              id: data.user.id,
              email,
              type: userType,
            },
          ]);

          if (dbError) {
            console.error("Database insert error:", dbError.message);
            throw new Error(dbError.message);
          }
        }

        await login(email, password);
      }
    } catch (err) {
      setError((err as Error).message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center text-[#1db954] mb-6">
        {isLogin ? "Welcome back to" : "Join"} FoodFella
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#1db954] focus:border-[#1db954]"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#1db954] focus:border-[#1db954]"
          />
        </div>

        {!isLogin && (
          <div>
            <label
              htmlFor="userType"
              className="block text-sm font-medium text-gray-700"
            >
              Account Type
            </label>
            <select
              id="userType"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#1db954] focus:border-[#1db954]"
            >
              <option value="user">User</option>
              <option value="merchant">Merchant</option>
            </select>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1db954] text-white p-2 rounded-lg shadow-md hover:bg-[#17a74c] transition disabled:bg-gray-400"
        >
          {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={toggleMode}
          className="text-sm text-[#1db954] hover:underline"
        >
          {isLogin
            ? "Don't have an account? Sign up"
            : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
};

export default Auth;
