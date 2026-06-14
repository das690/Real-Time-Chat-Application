import { ChatState } from "../../context/ChatProvider";
import SingleChat from "./SingleChat";

const ChatBox = () => {
  const { selectedChat } = ChatState();

  return (
    <div 
      className={`w-full md:w-2/3 bg-white/30 backdrop-blur-md rounded-2xl shadow-xl border border-white/40 p-4 flex-col h-full ${
        selectedChat ? "flex" : "hidden md:flex"
      }`}
    >
      <SingleChat />
    </div>
  );
};

export default ChatBox;