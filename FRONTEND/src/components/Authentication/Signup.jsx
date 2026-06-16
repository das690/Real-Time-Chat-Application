import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [pic, setPic] = useState();
  const [picLoading, setPicLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Function to upload the profile picture to Cloudinary securely
  const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      alert("Please Select an Image!");
      setPicLoading(false);
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      
      // --- NEW CODE: Using Cloudinary Environment Variables ---
      data.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
      data.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

      fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: data,
      })
      // --------------------------------------------------------
        .then((res) => {
          if (!res.ok) throw new Error("Upload failed");
          return res.json();
        })
        .then((data) => {
          setPic(data.url.toString()); // Save the image URL to state
          setPicLoading(false);
        })
        .catch((err) => {
          console.error(err);
          alert("Image upload failed. Please try again.");
          setPicLoading(false);
        });
    } else {
      alert("Please Select a valid Image file (JPEG/PNG)");
      setPicLoading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!name || !email || !password || !confirmpassword) {
      alert("Please Fill all the Fields");
      setLoading(false);
      return;
    }

    if (password !== confirmpassword) {
      alert("Passwords Do Not Match");
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      // --- THE CRITICAL UPDATE: Using the dynamic backend URL ---
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user`,
        {
          name,
          email,
          password,
          pic,
        },
        config
      );
      // ----------------------------------------------------------

      alert("Registration Successful!");
      
      // Save the user data (including the JWT token) to local storage
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      
      // Redirect the user to the chat page
      navigate("/chats");
    } catch (error) {
      alert("Error Occurred! Registration failed.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submitHandler} className="flex flex-col gap-4 w-full mt-4">
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1 drop-shadow-sm">
          Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border border-white/60 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50 backdrop-blur-sm text-gray-900 shadow-inner placeholder-gray-500"
          placeholder="Enter your name"
          required
        />
      </div>

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

      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1 drop-shadow-sm">
          Confirm Password
        </label>
        <input
          type="password"
          value={confirmpassword}
          onChange={(e) => setConfirmpassword(e.target.value)}
          className="w-full px-4 py-2 border border-white/60 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50 backdrop-blur-sm text-gray-900 shadow-inner placeholder-gray-500"
          placeholder="Confirm your password"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1 drop-shadow-sm">
          Upload your Picture
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
          className="w-full px-4 py-2 border border-white/60 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50 backdrop-blur-sm text-gray-900 shadow-inner file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition"
        />
      </div>

      <button
        type="submit"
        disabled={loading || picLoading}
        className="w-full bg-blue-600/90 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition mt-4 disabled:opacity-50 shadow-md"
      >
        {picLoading ? "Uploading Image..." : loading ? "Signing up..." : "Sign Up"}
      </button>
    </form>
  );
};

export default Signup;