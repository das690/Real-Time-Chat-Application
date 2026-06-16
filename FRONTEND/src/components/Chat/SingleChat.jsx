import { useEffect, useState, useRef } from "react";
import { ChatState } from "../../context/ChatProvider";
import { getSender } from "../../config/ChatLogics";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import UpdateGroupChatModal from "./UpdateGroupChatModal";

// --- NEW CODE: Using the environment variable for the backend URL ---
const ENDPOINT = import.meta.env.VITE_BACKEND_URL; 
// --------------------------------------------------------------------
var socket, selectedChatCompare;

const SingleChat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  
  // Typing states
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  
  // Image Upload state
  const [imageLoading, setImageLoading] = useState(false);
  const fileInputRef = useRef(null);

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  
  const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      setLoading(true);
      // --- NEW CODE: Dynamic backend URL ---
      const { data } = await axios.get(`${ENDPOINT}/api/message/${selectedChat._id}`, config);
      // -------------------------------------
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      alert("Failed to load the messages");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare || 
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });

    return () => {
      socket.off("message received");
    };
  });

  // Core function to send any text or image URL to the backend
  const sendDataMessage = async (contentToSend) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      setNewMessage(""); 

      // --- NEW CODE: Dynamic backend URL ---
      const { data } = await axios.post(
        `${ENDPOINT}/api/message`,
        {
          content: contentToSend,
          chatId: selectedChat._id,
        },
        config
      );
      // -------------------------------------

      setMessages([...messages, data]);
      socket.emit("new message", data);
    } catch (error) {
      alert("Failed to send the message");
    }
  };

  // Triggered when user hits Enter on the keyboard
  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      setTyping(false);
      sendDataMessage(newMessage);
    }
  };

  // Triggered when an image is selected from the file explorer
  const postDetails = (pics) => {
    setImageLoading(true);
    if (!pics) {
      alert("Please select an image!");
      setImageLoading(false);
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
      data.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

      fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: data,
      })
        .then((res) => {
          if (!res.ok) throw new Error("Upload failed");
          return res.json();
        })
        .then((data) => {
          sendDataMessage(data.secure_url.toString()); // Auto-send the image URL
          setImageLoading(false);
        })
        .catch((err) => {
          console.error("Cloudinary Error:", err);
          alert("Image upload failed. Please check your cloud configuration.");
          setImageLoading(false);
        });
    } else {
      alert("Please select a valid image file (JPEG or PNG)");
      setImageLoading(false);
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          {/* Chat Header */}
          <div className="text-lg md:text-xl pb-3 w-full font-semibold flex justify-between items-center border-b border-gray-200">
            <button 
              className="md:hidden bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md text-sm transition"
              onClick={() => setSelectedChat("")}
            >
              ⬅ Back
            </button>
            
            <span className="ml-2">
              {!selectedChat.isGroupChat ? (
                getSender(user, selectedChat.users)
              ) : (
                selectedChat.chatName.toUpperCase()
              )}
            </span>
            
            <div className="w-auto flex items-center">
              {selectedChat.isGroupChat ? (
                <>
                  <button 
                    onClick={() => setIsUpdateModalOpen(true)}
                    className="bg-gray-100 px-3 py-1 text-sm font-medium rounded-md hover:bg-gray-200 transition"
                  >
                    ⚙️ Group Info
                  </button>
                  <UpdateGroupChatModal 
                    fetchMessages={fetchMessages} 
                    isOpen={isUpdateModalOpen} 
                    onClose={() => setIsUpdateModalOpen(false)} 
                  />
                </>
              ) : (
                <span className="text-sm text-gray-500 italic">User Info</span>
              )}
            </div>
          </div>

          {/* Chat Messages and Input Area */}
          <div className="flex flex-col justify-end w-full h-full bg-gray-50 rounded-lg overflow-hidden mt-3 p-3 border border-gray-200">
            
            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-400">Loading messages...</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto mb-3 flex flex-col">
                <ScrollableChat messages={messages} />
              </div>
            )}
            
            {istyping ? (
              <div className="mb-2 ml-2 text-sm text-gray-500 italic flex items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce mr-1"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce mr-1 delay-75"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce mr-2 delay-150"></div>
                typing...
              </div>
            ) : (
              <></>
            )}
            
            {/* Input Bar with Attachment Button */}
            <div className="mt-2 shrink-0 flex items-center bg-white border border-gray-300 rounded-full px-2 py-1 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition">
              
              {/* Hidden File Input */}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={(e) => postDetails(e.target.files[0])}
                className="hidden"
              />

              {/* Attachment Button */}
              <button 
                onClick={() => fileInputRef.current.click()}
                disabled={imageLoading}
                className="p-2 text-gray-500 hover:text-blue-600 transition rounded-full hover:bg-gray-100 disabled:opacity-50"
                title="Attach Image"
              >
                📎
              </button>

              <input
                type="text"
                placeholder={imageLoading ? "Uploading image..." : "Type a message and press Enter..."}
                value={newMessage}
                onChange={typingHandler}
                onKeyDown={sendMessage}
                disabled={imageLoading}
                className="flex-1 bg-transparent px-3 py-2 focus:outline-none disabled:opacity-50"
              />
            </div>
            
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-2xl pb-3 text-gray-400 font-medium">
            Click on a user to start chatting
          </p>
        </div>
      )}
    </>
  );
};

export default SingleChat;