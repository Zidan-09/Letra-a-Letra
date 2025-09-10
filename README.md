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
│  ├─ node_modules/
│  ├─ src/
│  │  ├─ controllers/
│  │  │  ├─ gameController.ts
│  │  │  ├─ roomController.ts
│  │  │  └─ playerController.ts
│  │  ├─ routes/
│  │  │  ├─ gameRoutes.ts
│  │  │  ├─ playerRoutes.ts
│  │  │  └─ roomRoutes.ts
│  │  ├─ entities/
│  │  │  ├─ board.ts
│  │  │  ├─ game.ts
│  │  │  └─ player.ts
│  │  ├─ logs/
│  │  │  └─ .gitkeep
│  │  ├─ tests/
│  │  │  └─ tests.ts
│  │  ├─ middlewares/ (não implementado)
│  │  ├─ services/
│  │  │  ├─ gameServices.ts
│  │  │  ├─ roomServices.ts
│  │  │  └─ playerServices.ts
│  │  ├─ utils/
│  │  │  ├─ emits/gameEmits.ts
│  │  │  ├─ game_utils/
│  │  │  │  ├─ sendSocket.ts
│  │  │  │  └─ gameStatus.ts
│  │  │  ├─ requests/
│  │  │  │  ├─ gameRequests.ts
│  │  │  │  └─ roomRequests.ts
│  │  │  ├─ responses/
│  │  │  │  ├─ gameResponses.ts
│  │  │  │  ├─ roomResponses.ts
│  │  │  │  └─ serverResponses.ts
│  │  │  └─ server_utils/
│  │  │     ├─ handleResponse.ts
│  │  │     ├─ logEnum.ts
│  │  │     └─ logs.ts
│  │  ├─ app.ts
│  │  ├─ server.ts
│  │  └─ socket.ts
│  ├─ tsconfig.json
│  ├─ package.json
│  └─ .env
├─ ui/ (frontend temporário de teste)
│  ├─ assets/
│  ├─ pages/
│  │  ├─ index.html
│  │  ├─ join.html
│  │  └─ room.html
│  ├─ styles/
│  │  ├─ index/styles.css
│  │  ├─ join/styles.css
│  │  └─ room/styles.css
│  └─ scripts/
│     ├─ scripts.js
│     └─ roomScripts.js
├─ diagrams/
│  └─ fluxDiagram.drawio.svg
├─ frontend/
│  ├─ node_modules/
│  ├─ public/
│  ├─ src/
│  │  ├─ assets/
│  │  │  └─ react.svg
│  │  ├─ pages/
│  │  │  ├─ Home/
│  │  │  │  └─ HomePage.tsx
│  │  │  ├─ Join/
│  │  │  │  └─ JoinPage.tsx
│  │  │  └─ Room/
│  │  │     └─ RoomPage.tsx
│  │  ├─ services/
│  │  │  └─ socket.ts
│  │  ├─ App.tsx
│  │  ├─ main.tsx
│  │  ├─ styles.css
│  │  └─ vite-env.d.ts
│  ├─ .gitignore
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package.json
│  ├─ tsconfig.app.json
│  ├─ tsconfig.json
│  ├─ tsconfig.node.json
│  └─ vite.config.ts
├─ .vscode/
├─ .gitignore
├─ INIT.py
└─ README.md
```

## 10. Observações

- O frontend na pasta ui/ é apenas para testes da API e não fará parte do jogo final.

- O projeto está em versão alfa; recursos de progressão e monetização ainda serão implementados.

## 11. Como Rodar

- Execute o INIT.py