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
    // Check if the person clicking is an admin OR if they are trying to remove themselves
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      alert("Only admins can remove someone!");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.put(
        `http://localhost:5000/api/chat/groupremove`,
        { chatId: selectedChat._id, userId: user1._id },
        config
      );

      // If you left the group, clear the active chat. Otherwise, update the chat data.
      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      fetchMessages(); // Refresh the messages
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
      const { data } = await axios.put(
        `http://localhost:5000/api/chat/groupadd`,
        { chatId: selectedChat._id, userId: user1._id },
        config
      );

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
      const { data } = await axios.put(
        `http://localhost:5000/api/chat/rename`,
        { chatId: selectedChat._id, chatName: groupChatName },
        config
      );

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
      const { data } = await axios.get(`http://localhost:5000/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      alert("Failed to load search results");
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl font-bold">
          &times;
        </button>

        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
          {selectedChat.chatName.toUpperCase()}
        </h2>

        {/* List of current users */}
        <div className="flex flex-wrap gap-2 w-full mb-4">
          {selectedChat.users.map((u) => (
            <span
              key={u._id}
              className="bg-purple-600 text-white px-2 py-1 rounded-md text-sm flex items-center cursor-pointer hover:bg-red-500 transition"
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
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleRename}
            disabled={renameloading}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition shadow-sm font-medium disabled:opacity-50"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Search Results */}
        <div className="max-h-40 overflow-y-auto w-full mb-4">
          {loading ? (
            <div className="text-center text-sm text-gray-500">Loading...</div>
          ) : (
            searchResult?.slice(0, 4).map((user) => (
              <div
                key={user._id}
                onClick={() => handleAddUser(user)}
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

        {/* Leave Group Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => handleRemove(user)}
            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition shadow-sm font-medium"
          >
            Leave Group
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateGroupChatModal;