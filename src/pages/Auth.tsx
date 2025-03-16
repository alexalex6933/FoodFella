import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("user"); // Default type is 'user'
  const [error, setError] = useState("");
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        // Handle login
        await login(email, password);
      } else {
        // Handle registration
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw new Error(error.message);
        if (!data.user) throw new Error("User not created.");

        // Check if user already exists in the "users" table
        const { data: existingUser } = await supabase
          .from("users")
          .select("*")
          .eq("id", data.user.id)
          .single();

        if (!existingUser) {
          // Insert user details into the "users" table
          const { error: dbError } = await supabase.from("users").insert([
            {
              id: data.user.id,
              email,
              type: userType, // Store user type
            },
          ]);

          if (dbError) throw new Error(dbError.message);
        }

        // Automatically log in after sign-up
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
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-lg shadow-md">
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            required
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            required
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              required
            >
              <option value="user">User</option>
              <option value="merchant">Merchant</option>
            </select>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-[#1db954] text-white py-2 px-4 rounded-md hover:bg-[#169c46] transition-colors"
          disabled={loading}
        >
          {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={toggleMode}
          className="text-[#1db954] hover:text-[#169c46] text-sm"
        >
          {isLogin
            ? "Don't have an account? Sign up"
            : "Already have an account? Sign in"}
        </button>
      </div>

      {isLogin && (
        <p className="mt-4 text-sm text-gray-600 text-center">
          Demo accounts:
          <br />
          Customer: customer@example.com
          <br />
          Merchant: merchant@example.com
          <br />
          Password: password123
        </p>
      )}
    </div>
  );
};

export default Auth;
