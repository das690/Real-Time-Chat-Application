import { useState } from "react";
import axios from "axios";
import { ChatState } from "../../context/ChatProvider";

const UpdateGroupChatModal = ({ fetchMessages, isOpen, onClose }) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);

  const { selectedChat, setSelectedChat, user } = ChatState();

  // Function to remove a user (or leave the group yourself)
  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      alert("Only admins can remove someone!");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      
      // --- THE CRITICAL UPDATE: Using the dynamic backend URL ---
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat/groupremove`,
        { chatId: selectedChat._id, userId: user1._id },
        config
      );
      // ----------------------------------------------------------

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      fetchMessages(); 
      setLoading(false);
    } catch (error) {
      alert("Error removing user!");
      setLoading(false);
    }
  };

  // Function to add a user to the group
  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      alert("User is already in the group!");
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      alert("Only admins can add someone!");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      
      // --- THE CRITICAL UPDATE: Using the dynamic backend URL ---
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat/groupadd`,
        { chatId: selectedChat._id, userId: user1._id },
        config
      );
      // ----------------------------------------------------------

      setSelectedChat(data);
      setLoading(false);
    } catch (error) {
      alert("Error adding user!");
      setLoading(false);
    }
  };

  // Function to rename the group
  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      
      // --- THE CRITICAL UPDATE: Using the dynamic backend URL ---
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat/rename`,
        { chatId: selectedChat._id, chatName: groupChatName },
        config
      );
      // ----------------------------------------------------------

      setSelectedChat(data);
      setRenameLoading(false);
      setGroupChatName("");
    } catch (error) {
      alert("Error renaming group!");
      setRenameLoading(false);
      setGroupChatName("");
    }
  };

  // Function to search for new users to add
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;

    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      
      // --- THE CRITICAL UPDATE: Using the dynamic backend URL ---
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user?search=${search}`, 
        config
      );
      // ----------------------------------------------------------
      
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      alert("Failed to load search results");
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    // Glassmorphism Overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
      
      {/* Glassmorphism Modal Card */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md p-6 relative border border-white/50">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-2xl font-bold drop-shadow-sm transition"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 drop-shadow-sm">
          {selectedChat.chatName.toUpperCase()}
        </h2>

        {/* List of current users */}
        <div className="flex flex-wrap gap-2 w-full mb-4">
          {selectedChat.users.map((u) => (
            <span
              key={u._id}
              className="bg-purple-600/90 text-white px-2 py-1 rounded-md text-sm flex items-center cursor-pointer hover:bg-red-500 transition shadow-sm border border-white/20"
              onClick={() => handleRemove(u)}
              title="Click to remove"
            >
              {u.name}
              {selectedChat.groupAdmin._id === u._id && " (Admin)"}
              <span className="ml-1 text-xs font-bold">&times;</span>
            </span>
          ))}
        </div>

        {/* Rename Group Input */}
        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            placeholder="Rename Group"
            value={groupChatName}
            onChange={(e) => setGroupChatName(e.target.value)}
            className="flex-1 px-4 py-2 border border-white/60 bg-white/50 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-inner placeholder-gray-500 text-gray-900"
          />
          <button
            onClick={handleRename}
            disabled={renameloading}
            className="bg-green-600/90 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition shadow-md font-bold disabled:opacity-50"
          >
            Update
          </button>
        </div>

        {/* Add User Search Input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Add User to group"
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-4 py-2 border border-white/60 bg-white/50 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-inner placeholder-gray-500 text-gray-900"
          />
        </div>

        {/* Search Results */}
        <div className="max-h-40 overflow-y-auto w-full mb-4">
          {loading ? (
            <div className="text-center text-sm font-medium text-gray-700">Loading...</div>
          ) : (
            searchResult?.slice(0, 4).map((user) => (
              <div
                key={user._id}
                onClick={() => handleAddUser(user)}
                className="flex items-center p-2 mb-2 bg-white/40 hover:bg-white/70 rounded-lg cursor-pointer transition shadow-sm border border-white/50"
              >
                <img src={user.pic} className="w-8 h-8 rounded-full mr-3 shadow-sm" alt="avatar" />
                <div>
                  <p className="font-bold text-sm text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-600 font-medium">{user.email}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Leave Group Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => handleRemove(user)}
            className="bg-red-600/90 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition shadow-md font-bold"
          >
            Leave Group
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateGroupChatModal;