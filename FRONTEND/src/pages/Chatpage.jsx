import { ChatState } from "../context/ChatProvider";
import SideDrawer from "../components/Chat/SideDrawer";
import MyChats from "../components/Chat/MyChats";
import ChatBox from "../components/Chat/ChatBox";

const Chatpage = () => {
  // Pull the logged-in user's info from our global context
  const { user } = ChatState();

  return (
    <div className="w-full h-screen bg-gray-100 flex flex-col">
      {/* Top Navigation Bar */}
      {user && <SideDrawer />}
      
      {/* Main Chat Area: Takes up the remaining height */}
      <div className="flex flex-1 justify-between p-4 space-x-4 overflow-hidden">
        {user && <MyChats />}
        {user && <ChatBox />}
      </div>
    </div>
  );
};

export default Chatpage;