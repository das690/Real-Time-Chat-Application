import { Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Chatpage from "./pages/Chatpage";

function App() {
  return (
    // Update this div! Add bg-[url('/...')] bg-cover bg-center bg-fixed
    <div className="min-h-screen bg-[url('/bg.jpg')] bg-cover bg-center bg-fixed text-gray-900 font-sans">
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/chats" element={<Chatpage />} />
      </Routes>
    </div>
  );
}

export default App;