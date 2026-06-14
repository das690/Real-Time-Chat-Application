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

      const { data } = await axios.get("http://localhost:5000/api/chat", config);
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
      
      {/* Header section with New Group Button */}
      <div className="flex justify-between items-center pb-3 border-b">
        <h2 className="text-xl font-semibold text-gray-800">My Chats</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gray-100 px-3 py-1 text-sm font-medium rounded-md hover:bg-gray-200 transition"
        >
          New Group +
        </button>
      </div>

      {/* List of active chats */}
      <div className="flex-1 overflow-y-auto mt-4 flex flex-col space-y-2">
        {chats ? (
          chats.map((chat) => (
            <div
              onClick={() => setSelectedChat(chat)}
              className={`cursor-pointer px-4 py-3 rounded-lg transition ${
                selectedChat === chat 
                  ? "bg-blue-600 text-white shadow-md" 
                  : "bg-gray-50 text-gray-800 hover:bg-gray-100"
              }`}
              key={chat._id}
            >
              <p className="font-semibold">
                {/* If it's a group chat, show the group name. Otherwise, show the other user's name */}
                {!chat.isGroupChat
                  ? getSender(loggedUser, chat.users)
                  : chat.chatName}
              </p>
              
              {/* Display the latest message snippet if it exists */}
              {chat.latestMessage && (
                <p className={`text-xs mt-1 truncate ${selectedChat === chat ? "text-blue-100" : "text-gray-500"}`}>
                  <b>{chat.latestMessage.sender.name} : </b>
                  {chat.latestMessage.content}
                </p>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center mt-10">Loading chats...</p>
        )}
      </div>

      {/* Render the Modal Component */}
      <GroupChatModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
    </div>
  );
};

export default MyChats;