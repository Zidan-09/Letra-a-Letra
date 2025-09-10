// src/pages/HomePage.tsx
import { useState } from 'react';
import { socket } from '../../services/socket';
import type { Page } from '../../App';

type HomePageProps = {
  setNickname: (nickname: string) => void;
  navigate: (page: Page, data?: { roomId?: string }) => void;
};

function HomePage({ setNickname, navigate }: HomePageProps) {
  const [currentNickname, setCurrentNickname] = useState('');

  const handleCreateRoom = () => {
    if (!currentNickname.trim()) return alert('Nickname inválido');
    setNickname(currentNickname);

    // Conecta o socket e depois cria a sala  
    socket.connect();
    socket.once('connect', () => {
      fetch(`http://localhost:3333/room/createRoom`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ socket_id: socket.id, nickname: currentNickname }),
      })
      .then(res => res.json())
      .then(data => {
        console.log(data)
        if (data.message === 'room_created' && data.data.room_id) {
          // Navega para a RoomPage (o App.tsx vai receber e trocar o componente)
          // Em vez de localStorage, o App.tsx vai passar o roomId para o componente RoomPage
          // Nós faremos isso no próximo passo, por enquanto, vamos navegar.
          console.log('vamos')
          navigate('room', {roomId: data.data.room_id});
        }
      });
    });
  };

  const handleJoinRoom = () => {
    if (!currentNickname.trim()) return alert('Nickname inválido');
    setNickname(currentNickname);

    // Conecta e navega para a página de Join
    socket.connect();
    socket.once('connect', () => {
      navigate('join');
    });
  };

  return (
    <div className="panel">
      <div className="title">
        <h2>Letra a</h2>
        <h2>Letra</h2>
      </div>
      <input
        type="text"
        id="nickname"
        placeholder="Insert your nickname"
        value={currentNickname}
        onChange={(e) => setCurrentNickname(e.target.value)}
      />
      <div className="buttoms">
        <input type="button" value="Create Room" onClick={handleCreateRoom} />
        <input type="button" value="Join Room" onClick={handleJoinRoom} />
      </div>
    </div>
  );
}

export default HomePage;