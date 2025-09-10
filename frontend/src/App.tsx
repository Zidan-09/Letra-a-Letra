// src/App.tsx
import { useState } from 'react';
import HomePage from './pages/Home/HomePage';
import JoinPage from './pages/Join/JoinPage';
import RoomPage from './pages/Room/RoomPage';

// Define os tipos para facilitar a vida com TypeScript
export type Page = 'home' | 'join' | 'room';

function App() {
  const [page, setPage] = useState<Page>('home');
  const [nickname, setNickname] = useState<string>('');
  const [roomId, setRoomId] = useState<string>('');

  // Função para navegar entre as "páginas"
  const navigate = (targetPage: Page, data: { roomId?: string } = {}) => {
    if (data.roomId) {
      setRoomId(data.roomId);
    }
    setPage(targetPage);
  };

  const renderPage = () => {
    switch (page) {
      case 'home':
        return <HomePage setNickname={setNickname} navigate={navigate} />;
      case 'join':
        return <JoinPage nickname={nickname} setRoomId={setRoomId} navigate={navigate} />;
      case 'room':
        return <RoomPage nickname={nickname} roomId={roomId} navigate={navigate} />;
      default:
        return <HomePage setNickname={setNickname} navigate={navigate} />;
    }
  };

  return <div className="App">{renderPage()}</div>;
}

export default App;