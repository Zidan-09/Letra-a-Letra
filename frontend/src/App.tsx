import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/HomePage";
import CreateRoom from "./pages/Room/CreateRoomPage";
import JoinRoom from "./pages/Join/JoinRoomPage";
import Game from "./pages/Game/GamePage";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create" element={<CreateRoom />} />
      <Route path="/join" element={<JoinRoom />} />
      <Route path="/game" element={<Game />} />
    </Routes>
  );
};

export default App;
