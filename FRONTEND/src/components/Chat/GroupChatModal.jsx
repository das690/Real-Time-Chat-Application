import { useState } from "react";
import axios from "axios";
import { ChatState } from "../../context/ChatProvider";

const GroupChatModal = ({ isOpen, onClose, children }) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, chats, setChats } = ChatState();

  // Handle searching for users to add to the group
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      setSearchResult([]);
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
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

  // Add a searched user to the selected list
  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      alert("User is already added");
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  // Remove a user from the selected list before creating the group
  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  // Submit the data to your backend API to actually create the room
  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      alert("Please fill all the fields");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      // --- THE CRITICAL UPDATE: Using the dynamic backend URL ---
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      // ----------------------------------------------------------

      setChats([data, ...chats]); // Add the new group to the top of your chat list
      onClose(); // Close the modal
      alert("New Group Chat Created!");
    } catch (error) {
      alert("Failed to create the Chat!");
    }
  };

  // If the modal is not open, don't render anything
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
          Create Group Chat
        </h2>

        <div className="space-y-4">
          {/* Group Name Input */}
          <input
            type="text"
            placeholder="Chat Name"
            onChange={(e) => setGroupChatName(e.target.value)}
            className="w-full px-4 py-2 border border-white/60 bg-white/50 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-inner placeholder-gray-500 text-gray-900"
          />

          {/* User Search Input */}
          <input
            type="text"
            placeholder="Add Users eg: John, Jane"
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-4 py-2 border border-white/60 bg-white/50 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-inner placeholder-gray-500 text-gray-900"
          />

          {/* Render the Selected Users as little tags */}
          <div className="flex flex-wrap gap-2 w-full">
            {selectedUsers.map((u) => (
              <span
                key={u._id}
                className="bg-blue-600/90 text-white px-2 py-1 rounded-md text-sm flex items-center cursor-pointer hover:bg-red-500 transition shadow-sm border border-white/20"
                onClick={() => handleDelete(u)}
                title="Click to remove"
              >
                {u.name} <span className="ml-1 text-xs font-bold">&times;</span>
              </span>
            ))}
          </div>

          {/* Render Search Results */}
          <div className="max-h-40 overflow-y-auto w-full">
            {loading ? (
              <div className="text-center text-sm font-medium text-gray-700">Loading...</div>
            ) : (
              searchResult?.slice(0, 4).map((user) => ( // Only show top 4 results
                <div
                  key={user._id}
                  onClick={() => handleGroup(user)}
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
        </div>

        {/* Create Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-blue-600/90 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition shadow-md font-bold"
          >
            Create Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupChatModal;