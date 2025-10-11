import { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { SocketProvider } from "./services/socketProvider";
import { preloadAvatars } from "./utils/avatars";
import { preloadPowers } from "./utils/powers";
import Home from "./pages/Home";
import Create from "./pages/Create";
import Room from "./pages/Room";
import Lobby from "./pages/Lobby";
import Game from "./pages/Game";

function App() {

  useEffect(() => {
    preloadAvatars();
    preloadPowers();
  }, []);
  
  return (
    <Router>
      <SocketProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/room" element={<Room />} />
          <Route path="/lobby/:room_id" element={<Lobby />} />
          <Route path="/game/:room_id" element={<Game />} />
          <Route path="/winner/:room_id" element={<div>Winner</div>} />
        </Routes>
      </SocketProvider>
    </Router>
  );
}

export default App;