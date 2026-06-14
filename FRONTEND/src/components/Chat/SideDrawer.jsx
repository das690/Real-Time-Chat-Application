import { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getSender } from "../../config/ChatLogics";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // Controls the sliding drawer
  const [isNotifOpen, setIsNotifOpen] = useState(false); // Controls the notification dropdown

  // Destructure the notification state
  const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();
  const navigate = useNavigate();

  // Function to handle logging out
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  // Function to search users via API
  const handleSearch = async () => {
    if (!search) {
      alert("Please enter a name or email to search");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`http://localhost:5000/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      alert("Failed to load search results");
      setLoading(false);
    }
  };

  // Function to create or access an existing chat with the searched user
  const accessChat = async (userId) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post("http://localhost:5000/api/chat", { userId }, config);

      // If this is a brand new chat, add it to our list of chats
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      
      setSelectedChat(data); // Make this the active chat
      setIsDrawerOpen(false); // Close the drawer
    } catch (error) {
      alert("Error fetching the chat");
    }
  };

  return (
    <>
      {/* Top Navbar with Glassmorphism */}
      <div className="w-full bg-white/30 backdrop-blur-md flex justify-between items-center p-4 border-b border-white/40 shadow-sm relative z-10">
        <button 
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center text-gray-800 hover:text-blue-700 font-medium px-3 py-1 bg-white/40 rounded hover:bg-white/60 transition shadow-sm border border-white/50"
        >
          🔍 <span className="ml-2 hidden md:block">Search Users</span>
        </button>
        
        <h1 className="text-2xl font-bold text-blue-700 drop-shadow-sm">Chat App</h1>
        
        <div className="flex items-center space-x-4">
          
          {/* Notification Bell & Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="text-2xl relative mt-1 hover:opacity-80 transition"
            >
              🔔
              {notification.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                  {notification.length}
                </span>
              )}
            </button>

            {/* Notification Dropdown Menu (also slightly glassy) */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white/90 backdrop-blur-lg border border-white/50 shadow-xl rounded-md overflow-hidden z-50">
                {!notification.length && <div className="p-3 text-gray-500 text-sm">No New Messages</div>}
                
                {notification.map((notif) => (
                  <div 
                    key={notif._id}
                    className="p-3 border-b border-gray-200/50 hover:bg-blue-50/50 cursor-pointer text-sm font-medium text-gray-800 transition"
                    onClick={() => {
                      // Set the selected chat to the one from the notification
                      setSelectedChat(notif.chat);
                      // Remove this notification from the list
                      setNotification(notification.filter((n) => n !== notif));
                      // Close the dropdown
                      setIsNotifOpen(false);
                    }}
                  >
                    {notif.chat.isGroupChat
                      ? `New Message in ${notif.chat.chatName}`
                      : `New Message from ${getSender(user, notif.chat.users)}`}
                  </div>
                ))}
              </div>
            )}
          </div>

          <span className="font-medium text-gray-800 hidden sm:block drop-shadow-sm">{user?.name}</span>
          <button 
            onClick={logoutHandler}
            className="text-sm font-medium text-red-600 hover:text-red-800 bg-white/40 px-3 py-1 rounded hover:bg-white/60 transition shadow-sm border border-white/50"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Overlay Background when drawer is open */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20 transition-opacity"
          onClick={() => setIsDrawerOpen(false)}
        ></div>
      )}

      {/* Sliding Drawer Panel with Glassmorphism */}
      <div 
        className={`fixed top-0 left-0 h-full w-80 bg-white/60 backdrop-blur-xl shadow-2xl z-30 transform transition-transform duration-300 ease-in-out border-r border-white/40 ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-white/50 flex justify-between items-center bg-white/30">
          <h2 className="text-lg font-bold text-gray-800">Search Users</h2>
          <button onClick={() => setIsDrawerOpen(false)} className="text-gray-600 hover:text-red-600 font-bold text-2xl drop-shadow-sm">
            &times;
          </button>
        </div>

        <div className="p-4 flex space-x-2">
          <input
            type="text"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-3 py-2 border border-white/60 bg-white/50 backdrop-blur-sm rounded focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-inner placeholder-gray-500 text-gray-900"
          />
          <button 
            onClick={handleSearch}
            className="bg-blue-600/90 text-white px-4 py-2 rounded hover:bg-blue-700 transition shadow-md"
          >
            Go
          </button>
        </div>

        <div className="p-4 overflow-y-auto h-full pb-20">
          {loading ? (
            <p className="text-center text-gray-700 font-medium">Loading...</p>
          ) : (
            searchResult?.map((searchedUser) => (
              <div
                key={searchedUser._id}
                onClick={() => accessChat(searchedUser._id)}
                className="flex items-center p-3 mb-2 bg-white/40 hover:bg-white/70 rounded-lg cursor-pointer transition shadow-sm border border-white/50"
              >
                <img 
                  src={searchedUser.pic} 
                  alt={searchedUser.name} 
                  className="w-10 h-10 rounded-full mr-3 shadow-sm"
                />
                <div>
                  <p className="font-bold text-gray-800">{searchedUser.name}</p>
                  <p className="text-xs text-gray-600 font-medium">Email: {searchedUser.email}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default SideDrawer;