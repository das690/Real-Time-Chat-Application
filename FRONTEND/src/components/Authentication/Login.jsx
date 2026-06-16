import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault(); // Prevents the page from refreshing on form submit
    
    if (!email || !password) {
      alert("Please Fill all the Fields");
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      setLoading(true);

      // --- THE CRITICAL UPDATE: Using the dynamic backend URL ---
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/login`,
        { email, password },
        config
      );
      // ----------------------------------------------------------

      alert("Login Successful");
      
      // Save the user data (including the JWT token) to local storage
      localStorage.setItem("userInfo", JSON.stringify(data));
      
      setLoading(false);
      
      // Redirect the user to the chat page
      navigate("/chats");
    } catch (error) {
      alert("Error Occurred! Invalid Email or Password");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submitHandler} className="flex flex-col gap-4 w-full mt-4">
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1 drop-shadow-sm">
          Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-white/60 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50 backdrop-blur-sm text-gray-900 shadow-inner placeholder-gray-500"
          placeholder="Enter your email"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1 drop-shadow-sm">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-white/60 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50 backdrop-blur-sm text-gray-900 shadow-inner placeholder-gray-500"
          placeholder="Enter your password"
          required
        />
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600/90 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition mt-4 disabled:opacity-50 shadow-md"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
      
      {/* Optional: A helpful button so recruiters can test your app without making an account */}
      <button
        type="button"
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("123456");
        }}
        className="w-full bg-red-500/90 text-white font-bold py-2 px-4 rounded-md hover:bg-red-600 transition shadow-md"
      >
        Get Guest User Credentials
      </button>
    </form>
  );
};

export default Login;