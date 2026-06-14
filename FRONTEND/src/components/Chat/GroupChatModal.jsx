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
      const { data } = await axios.get(`http://localhost:5000/api/user?search=${search}`, config);
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

      const { data } = await axios.post(
        "http://localhost:5000/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl font-bold"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
          Create Group Chat
        </h2>

        <div className="space-y-4">
          {/* Group Name Input */}
          <input
            type="text"
            placeholder="Chat Name"
            onChange={(e) => setGroupChatName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* User Search Input */}
          <input
            type="text"
            placeholder="Add Users eg: John, Jane"
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Render the Selected Users as little tags */}
          <div className="flex flex-wrap gap-2 w-full">
            {selectedUsers.map((u) => (
              <span
                key={u._id}
                className="bg-blue-600 text-white px-2 py-1 rounded-md text-sm flex items-center cursor-pointer hover:bg-red-500 transition"
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
              <div className="text-center text-sm text-gray-500">Loading...</div>
            ) : (
              searchResult?.slice(0, 4).map((user) => ( // Only show top 4 results
                <div
                  key={user._id}
                  onClick={() => handleGroup(user)}
                  className="flex items-center p-2 mb-2 bg-gray-50 hover:bg-blue-100 rounded cursor-pointer transition border border-transparent hover:border-blue-300"
                >
                  <img src={user.pic} className="w-8 h-8 rounded-full mr-3" alt="avatar" />
                  <div>
                    <p className="font-semibold text-sm">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
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
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition shadow-sm font-medium"
          >
            Create Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupChatModal;