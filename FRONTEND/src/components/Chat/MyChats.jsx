import { useEffect, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";
import { getSender } from "../../config/ChatLogics";
import GroupChatModal from "./GroupChatModal";

const MyChats = () => {
  const [loggedUser, setLoggedUser] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls the modal visibility
  
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  // Function to fetch all existing chats for the logged-in user
  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      // --- THE CRITICAL UPDATE: Using the dynamic backend URL ---
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/chat`, config);
      // ----------------------------------------------------------
      
      setChats(data);
    } catch (error) {
      alert("Failed to load your chats");
    }
  };

  useEffect(() => {
    // Grab the user from local storage so we know who is logged in
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, []);

  return (
    <div className={`w-full md:w-1/3 bg-white/30 backdrop-blur-md rounded-2xl shadow-xl border border-white/40 p-4 flex-col h-full ${selectedChat ? "hidden md:flex" : "flex"}`}>
      
      {/* Header section with Glassmorphism */}
      <div className="flex justify-between items-center pb-3 border-b border-white/40">
        <h2 className="text-xl font-bold text-gray-800 drop-shadow-sm">My Chats</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-white/40 px-3 py-1 text-sm font-bold text-gray-800 rounded-md hover:bg-white/60 transition shadow-sm border border-white/50"
        >
          New Group +
        </button>
      </div>

      {/* List of active chats */}
      <div className="flex-1 overflow-y-auto mt-4 flex flex-col space-y-2 pr-1">
        {chats ? (
          chats.map((chat) => (
            <div
              onClick={() => setSelectedChat(chat)}
              className={`cursor-pointer px-4 py-3 rounded-xl transition border ${
                selectedChat === chat 
                  ? "bg-blue-600/90 text-white shadow-md border-blue-500" 
                  : "bg-white/40 text-gray-800 hover:bg-white/60 border-white/50 shadow-sm"
              }`}
              key={chat._id}
            >
              <p className="font-bold">
                {/* If it's a group chat, show the group name. Otherwise, show the other user's name */}
                {!chat.isGroupChat
                  ? getSender(loggedUser, chat.users)
                  : chat.chatName}
              </p>
              
              {/* Display the latest message snippet if it exists */}
              {chat.latestMessage && (
                <p className={`text-xs mt-1 truncate font-medium ${selectedChat === chat ? "text-blue-100" : "text-gray-600"}`}>
                  <b>{chat.latestMessage.sender.name} : </b>
                  {/* Quick check: If the latest message is a Cloudinary link, show "Image" instead of the long URL */}
                  {chat.latestMessage.content.includes("cloudinary.com") 
                    ? "📷 Image" 
                    : chat.latestMessage.content}
                </p>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-700 font-medium text-center mt-10">Loading chats...</p>
        )}
      </div>

      {/* Render the Modal Component */}
      <GroupChatModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
    </div>
  );
};

export default MyChats;