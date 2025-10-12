# Letra a Letra

**Descrição:** Um jogo multiplayer baseado em caça-palavras e batalha naval, onde os jogadores disputam para encontrar mais letras usando de todos os meios possíveis para atrapalhar seu adversário.

---

## 1. Visão Geral
- **Gênero:** Tabuleiro / Estratégia / Multiplayer  
- **Plataforma:** Web  
- **Público-alvo:** Todos  
- **Objetivo principal:** Encontrar mais palavras escondidas na grade do que o oponente.

---

## 2. Mecânicas de Jogo
- **Controles:** A partir de cliques  
- **Regras principais:**  
  - Cada partida é entre 2 jogadores, jogando em turnos.  
  - O jogo sorteia quem inicia.  
  - Cada jogador pode revelar uma letra da grade por turno.  
  - Letras reveladas contribuem para formar palavras; poderes secretos podem ser usados para atrapalhar o adversário.  
- **Pontuação:** Cada palavra encontrada = 1 ponto.  
  - Se o jogador 1 descobrir parte da palavra, mas o jogador 2 descobrir a última letra, o ponto vai para o jogador 2.  
- **Condição de vitória:** Jogador com maior pontuação vence.

---

## 3. Estrutura do Jogo
- **Telas/Páginas principais:**  
  - **Home Page:** Insere nickname e escolhe criar ou entrar em sala.  
  - **Create Room Page:** Configura e cria a sala.  
  - **Rooms Page:** Lista salas públicas e permite inserir código de sala específica.  
  - **Game Page:** Exibe jogadores na sala, permite iniciar partida, mostra o jogo e o vencedor no final.  

- **Fluxo de navegação:**  
```text
Home -> Create Room
Home -> Rooms
Rooms -> Game
```

## 4. Personagens / Avatares
- Avatares padrões do jogo
- O jogador escolhe um avatar na Home apenas para identificação visual

## 5. Sistema de Multiplayer

- **Tipo:** Online, multiplayer

- **Salas:** Cada sala suporta 2 jogadores, jogo por turnos

- **Limite de jogadores:** 2 por sala

## 6. Progressão e Recompensas

- Não há sistema de itens, moedas ou recompensas nesta versão alfa.

## 7. Monetização

- Na versão final, o jogo contará com alguns anúncios.

## 8. Tecnologias Utilizadas

- Frontend: React, Vite

- Backend: Node.js com Express

- WebSockets: Socket.io

- Outras bibliotecas: Nanoid, Cors, Dotenv, React-DOM, Socket.io-client

## 9. Estrutura de Pastas do Projeto
```text
root/
├─ api/
│  ├─ src/
│  │  ├─ controllers/
│  │  │  ├─ gameController.ts
│  │  │  ├─ roomController.ts
│  │  │  └─ playerController.ts
│  │  ├─ entities/
│  │  │  ├─ board.ts
│  │  │  ├─ cell.ts
│  │  │  ├─ game.ts
│  │  │  └─ player.ts
│  │  ├─ logs/
│  │  │  └─ .gitkeep
│  │  ├─ middleware/
│  │  │  ├─ gameMiddleware.ts
│  │  │  ├─ playerMiddleware.ts
│  │  │  └─ roomMiddleware.ts
│  │  ├─ routes/
│  │  │  ├─ gameRoutes.ts
│  │  │  ├─ playerRoutes.ts
│  │  │  └─ roomRoutes.ts
│  │  ├─ services/
│  │  │  ├─ gameService.ts
│  │  │  ├─ roomService.ts
│  │  │  └─ playerService.ts
│  │  ├─ settings/
│  │  │  ├─ board.json
│  │  │  ├─ cell.json
│  │  │  ├─ server.json
│  │  │  └─ themes.json
│  │  ├─ tests/
│  │  │  └─ tests.ts
│  │  ├─ utils/
│  │  │  ├─ board/
│  │  │  │  ├─ canPlaceWord.ts
│  │  │  │  ├─ checkCompletedWord.ts
│  │  │  │  ├─ placeWord.ts
│  │  │  │  ├─ selectTheme.ts
│  │  │  │  └─ themesEnum.ts
│  │  │  ├─ cell/
│  │  │  │  └─ powerRarity.ts
│  │  │  ├─ emits/
│  │  │  │  └─ gameEmits.ts
│  │  │  ├─ game/
│  │  │  │  ├─ assignPowerToPlayer.ts
│  │  │  │  ├─ gameModes.ts
│  │  │  │  ├─ gameStatus.ts
│  │  │  │  ├─ movements.ts
│  │  │  │  ├─ movementsEnum.ts
│  │  │  │  ├─ nullPlayer.ts
│  │  │  │  └─ sendSocket.ts
│  │  │  ├─ requests/
│  │  │  │  ├─ gameRequess.ts
│  │  │  │  ├─ playerRequests.ts
│  │  │  │  └─ roomRequests.ts
│  │  │  ├─ responses/
│  │  │  │  ├─ gameResponses.ts
│  │  │  │  ├─ playerResponses.ts
│  │  │  │  ├─ roomResponses.ts
│  │  │  │  └─ serverResponses.ts
│  │  │  ├─ server_utils/
│  │  │  │  ├─ handleResponse.ts
│  │  │  │  ├─ handleSocket.ts
│  │  │  │  ├─ logEnum.ts
│  │  │  │  └─ logs.ts
│  │  │  └─ enumNicknames.ts
│  │  ├─ app.ts
│  │  ├─ server.ts
│  │  └─ socket.ts
│  ├─ tsconfig.json
│  └─ package.json
├─ ui/
│  ├─ public/
│  ├─ src/
│  │  ├─ assets/
│  │  │  ├─ avatar/
│  │  │  │  ├─ avatar-1.png
│  │  │  │  └─ avatar-2.png
│  │  │  ├─ buttons/
│  │  │  │  ├─ icon-back.png
│  │  │  │  ├─ icon-create.png
│  │  │  │  ├─ icon-enter.png
│  │  │  │  ├─ icon-help.png
│  │  │  │  ├─ icon-play.png
│  │  │  │  └─ icon-refresh.png
│  │  │  ├─ powers/
│  │  │  │  ├─ icon-blind-min.png
│  │  │  │  ├─ icon-blind.png
│  │  │  │  ├─ icon-block-min.png
│  │  │  │  ├─ icon-block.png
│  │  │  │  ├─ icon-detecttraps-min.png
│  │  │  │  ├─ icon-detecttraps.png
│  │  │  │  ├─ icon-freeze-min.png
│  │  │  │  ├─ icon-freeze.png
│  │  │  │  ├─ icon-imunity-min.png
│  │  │  │  ├─ icon-imunity.png
│  │  │  │  ├─ icon-lantern-min.png
│  │  │  │  ├─ icon-lantern.png
│  │  │  │  ├─ icon-spy-min.png
│  │  │  │  ├─ icon-spy.png
│  │  │  │  ├─ icon-trap-min.png
│  │  │  │  ├─ icon-trap.png
│  │  │  │  ├─ icon-unblock-min.png
│  │  │  │  ├─ icon-unblock.png
│  │  │  │  ├─ icon-unfreeze-min.png
│  │  │  │  └─ icon-unfreeze.png
│  │  │  ├─ background.png
│  │  │  └─ logo.png
│  │  ├─ components/
│  │  │  ├─ RoomItem.tsx
│  │  │  ├─ RoomList.tsx
│  │  │  └─ RoomPopup.tsx
│  │  ├─ pages/
│  │  │  ├─ Create.tsx
│  │  │  ├─ Home.tsx
│  │  │  └─ Room.tsx
│  │  ├─ services/
│  │  │  └─ socketProvider.tsx
│  │  ├─ styles/
│  │  │  ├─ Create/
│  │  │  ├─ Room/
│  │  │  │  ├─ RoomItem.module.css
│  │  │  │  ├─ RoomList.module.css
│  │  │  │  └─ RoomPopup.module.css
│  │  │  ├─ Create.module.css
│  │  │  ├─ Home.module.css
│  │  │  └─ Room.module.css
│  │  ├─ utils/
│  │  │  ├─ room_utils.ts
│  │  │  ├─ server_utils.ts
│  │  │  └─ socket.ts
│  │  ├─ App.css
│  │  ├─ App.tsx
│  │  ├─ index.css
│  │  ├─ main.tsx
│  │  └─ vite-env.d.ts
│  ├─ .gitignore
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package.json
│  ├─ tsconfig.app.json
│  ├─ tsconfig.json
│  ├─ tsconfig.node.json
│  └─ vite.config.ts
├─ diagrams/
│  └─ fluxDiagram.drawio.svg
├─ .vscode/
├─ .gitignore
├─ INIT.py
└─ README.md
```

## 10. Como Rodar

- **Instalação:** npm install
- **Execução:** npm start