# 🎮 GDD — Letra a Letra

---

### 1. 📌 Visão Geral

Nome: Letra a Letra
Gênero: Estratégia por turnos com elementos de caos
Plataforma: Mobile (frontend em Godot Engine + backend em Spring Boot)
Público-alvo: Todas as idades

Pitch:
*Um jogo competitivo onde dois jogadores revelam um caça-palavras oculto célula por célula, utilizando estratégia e poderes especiais para encontrar palavras antes do adversário.*

---
### 2. 🔁 Loop Principal
1. Jogadores entram em uma partida
2. Turnos alternados entre os jogadores
3. No turno, o jogador pode:
    - Revelar uma célula
    - Usar um poder
4. O servidor valida e atualiza o estado
5. Palavras são descobertas automaticamente
6. Pontuação é atualizada
7. O jogo termina quando um jogador atinge a condição de vitória

---
### 3. 🧠 Mecânicas Principais
- Estrutura do jogo:
  - Tabuleiro 10x10
  - 5 palavras escondidas por partida
  - Todas as células começam ocultas
  - Letras são reveladas progressivamente
- Ações do jogador:
  - Revelar uma célula
  - Usar um poder (consome turno)
- Condição de vitória
  - Primeiro jogador a atingir 3 pontos vence
  - Cada palavra descoberta vale 1 ponto

---
### 4. 🧩 Sistema de Palavras
- Palavras são posicionadas com base na dificuldade
- Descoberta é automática
- Quando todas as letras de uma palavra são reveladas:
  - O jogador pontua

---
### 5. 🎮 Modos de Jogo
- Direções por dificuldade:
  1. Fácil: apenas horizontal e vertical (frente)
  2. Normal: inclui horizontal e vertical reverso
  3. Difícil: adiciona diagonais
  4. Insano: todas as direções
  5. Cataclismo: todas as direções
- 💀 Modo Cataclismo:
  - Todas as células possuem poder
  - Poderes comuns praticamente removidos
  - Alta frequência de poderes raros, épicos e lendários
  - O poder Immunity é removido neste modo
  - Foco total em caos e imprevisibilidade

---
### 6. 🎲 Sistema de Poderes
- Geração de poderes:
  - Cada célula possui uma chance de conter um poder
  - Essa chance varia conforme a dificuldade
  - Caso tenha poder, ele é definido por raridade
  - Raridades:
    1. Comum
    2. Raro
    3. Épico
    4. Lendário

---
### 7. 🎒 Inventário
- Cada jogador pode armazenar até 5 poderes
- O jogador pode descartar poderes manualmente
- Se o inventário estiver cheio:
  - novos poderes são descartados automaticamente

---
### 8. ⚡ Tipos de Poderes
- Manipulação (afetam o tabuleiro):
  1. Block: bloqueia uma célula (exige 3 interações para desbloquear)
  2. Unblock: remove bloqueio instantaneamente
  3. Trap: armadilha invisível que faz o adversário perder o turno
  4. Detect Traps: revela armadilhas do adversário
  5. Spy: revela temporariamente uma célula apenas para o jogador
- Efeito (afetam jogadores):
  1. Freeze: impede o adversário de jogar por alguns turnos
  2. Unfreeze: remove congelamento
  3. Blind: oculta letras por 3 turnos
  4. Lantern: remove o efeito Blind
  5. Immunity: bloqueia efeitos negativos (não disponível no Cataclismo)

---
### 9. 🪤 Regras Específicas
- Trap
  - Invisível para o adversário
  - Visível para quem plantou
  - Pode ser removida pelo próprio jogador ao clicar nela
  - Ao ser ativada:
    1. ocorre uma animação
    2. o jogador perde o turno
- Spy
  - Revelação temporária
  - Duração fixa de 3 turnos
  - Não altera o estado real do jogo

---
### 10. ⚠️ Regras de Interação
- Células
  - Apenas um efeito ativo por célula
  - Ações inválidas são bloqueadas
  - Feedback visual deve indicar ações permitidas ou não
- Efeitos em jogadores
  - Apenas um efeito ativo por jogador
  - Efeitos não acumulam
  - Aplicar o mesmo efeito reinicia sua duração
- Restrições
  - Uma célula não pode ter múltiplos efeitos ativados ao mesmo tempo
  - Um jogador não pode ter múltiplos efeitos negativos diferentes ao mesmo tempo

---
### 11. 👥 Multiplayer
- Partidas com 2 jogadores
- Suporte a espectadores (sem interação)
- Turnos alternados
- Servidor responsável por validar todas as ações

---
### 12. 🔌 Comunicação
- WebSocket para comunicação em tempo real
- API REST para:
  - criação de partidas
  - entrada em jogos

---
### 13. 🎨 Temas
- Temas predefinidos (ex: frutas, animais, etc.)

---
### 14. 🚀 MVP (Produto Mínimo)
- Inclui
  - Multiplayer funcional
  - Sistema de turnos
  - Revelação de células
  - Sistema básico de pontuação
  - Alguns poderes principais
- Não inclui inicialmente
  - Todos os poderes
  - Espectadores
  - Balanceamento refinado
  - Polimento visual completo

---
### 15. 🔥 Diferenciais
1. Mistura de estratégia e sorte
2. Fácil de aprender
3. Alta rejogabilidade
4. Sistema de poderes dinâmico
5. Modo Cataclismo como experiência única

---
### 16. ⚠️ Pontos de Atenção
- Balanceamento das probabilidades
- Impacto de poderes fortes como Freeze
- Frequência de poderes em dificuldades altas
- Clareza visual dos estados do jogo

---
### 🏁 Conclusão

Letra a Letra é um jogo baseado em descoberta progressiva, estratégia e adaptação ao caos, oferecendo uma experiência acessível e ao mesmo tempo profunda.