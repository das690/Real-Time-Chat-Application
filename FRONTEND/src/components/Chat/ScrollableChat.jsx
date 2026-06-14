import { ChatState } from "../../context/ChatProvider";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  // Helper function to check if the message is an image URL
  const isImage = (content) => {
    return content.includes("cloudinary.com");
  };

  return (
    <div className="flex flex-col gap-2 pr-2">
      {messages &&
        messages.map((m) => (
          <div
            key={m._id}
            className={`flex ${
              m.sender._id === user._id ? "justify-end" : "justify-start"
            }`}
          >
            {/* Show profile picture if it's the other person's message */}
            {m.sender._id !== user._id && (
              <img
                src={m.sender.pic}
                alt={m.sender.name}
                className="w-8 h-8 rounded-full mr-2 self-end shadow-sm"
                title={m.sender.name}
              />
            )}
            
            {/* The actual message bubble */}
            <span
              className={`px-4 py-2 rounded-2xl max-w-[75%] ${
                m.sender._id === user._id
                  ? "bg-blue-600 text-white rounded-br-none" // Your messages (Blue)
                  : "bg-gray-200 text-gray-800 rounded-bl-none" // Their messages (Gray)
              } ${isImage(m.content) ? "p-1 bg-transparent" : ""}`} // Remove padding if it's just an image
            >
              {isImage(m.content) ? (
                <img 
                  src={m.content} 
                  alt="attachment" 
                  className="rounded-xl max-h-60 object-contain cursor-pointer hover:opacity-90 transition shadow-sm border border-gray-200"
                  onClick={() => window.open(m.content, "_blank")} // Opens full image in new tab
                />
              ) : (
                m.content
              )}
            </span>
          </div>
        ))}
    </div>
  );
};

export default ScrollableChat;