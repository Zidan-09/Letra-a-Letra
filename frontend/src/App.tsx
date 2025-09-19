// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import CreateRoomPage from './pages/Room/CreateRoomPage';
import JoinRoomPage from './pages/Join/JoinRoomPage';
import GamePage from './pages/Game/GamePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/create" element={<CreateRoomPage />} />
      <Route path="/join" element={<JoinRoomPage />} />
      <Route path="/game/:roomId" element={<GamePage />} />
    </Routes>
  );
}

export default App;