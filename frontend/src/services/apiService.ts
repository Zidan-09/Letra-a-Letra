// import axios from 'axios';
// import type{ Room } from '../types';

// const apiClient = axios.create({
//   // Garanta que seu backend está rodando nesta porta
//   baseURL: 'http://localhost:3333', 
// });

// export const apiService = {
//   // GET /getRooms
//   getRooms: async (): Promise<Room[]> => {
//     // Assumindo que a resposta é { rooms: Room[] }
//     const response = await apiClient.get<{ data: Room[] }>('/room/getRooms'); 
//     return response.data.data.filter(room => !room.privateRoom);
//   },

//   // POST /room/createRoom
//   createRoom: async (nickname: string, settings: RoomSettings): Promise<CreateRoomResponse> => {
//     const response = await apiClient.post<CreateRoomResponse>('/room/createRoom', { nickname , ...settings});
//     return response.data;
//   },

//   // POST /room/joinRoom
//   joinRoom: async (roomId: string, nickname: string): Promise<JoinRoomResponse> => {
//     const response = await apiClient.post<JoinRoomResponse>('/room/joinRoom', { room_id: roomId, nickname });
//     return response.data;
//   },

//   // POST /game/startGame
//   startGame: async (roomId: string, playerId: string): Promise<void> => {
//     // Assumindo que o corpo da requisição precisa do id da sala e do jogador que iniciou
//     await apiClient.post('/game/startGame', { room_id: roomId, player_id: playerId });
//   },

//   // POST /game/moveGame
//   makeMove: async (roomId: string, playerId: string, move: { x: number, y: number }): Promise<void> => {
//     // Adapte o objeto 'move' para o que seu jogo precisa
//     await apiClient.post('/game/moveGame', { room_id: roomId, player_id: playerId, movement: "REVEAL", x:move.x, y:move.y });
//   },

//     leaveRoom: async (roomId: string, playerId: string): Promise<void> => {
//     await apiClient.post('/room/leaveRoom', { room_id: roomId, player_id: playerId });
//   }
// };