import { useState } from 'react';
import { socket } from '../../services/socket';
import type { Page } from '../../App';

type JoinPageProps = {
  nickname: string;
  setRoomId: (id: string) => void;
  navigate: (page: Page) => void;
};

function JoinPage({ nickname, setRoomId, navigate }: JoinPageProps) {
  const [inputRoomId, setInputRoomId] = useState('');

  const handleJoin = () => {
    if (!inputRoomId.trim()) return alert('Id de sala inválido');

    fetch(`http://localhost:3333/room/joinRoom`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        socket_id: socket.id,
        nickname: nickname,
        room_id: inputRoomId,
      }),
    })
    .then(res => res.json())
    .then(data => {
      if (data.message === 'room_joinned') {
        setRoomId(inputRoomId); // Salva o ID da sala no estado do App
        navigate('room');     // Navega para a sala
      } else {
        alert(data.message);
      }
    });
  };

  return (
    <div className="panel">
      <h2>Join in Room</h2>
      <input
        type="text"
        id="room_id"
        placeholder="Insert the room ID"
        value={inputRoomId}
        onChange={(e) => setInputRoomId(e.target.value)}
      />
      <input
        type="button"
        value="Join"
        onClick={handleJoin}
      />
    </div>
  );
}

export default JoinPage;