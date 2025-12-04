import type { MovementsEnum } from "./room_utils";

export const PowerDescriptions: { power: MovementsEnum, description: string, warning: string | null }[] = [
  {
    power: "BLOCK",
    description: "Bloqueia a célula escolhida. O adversário precisará clicar nela 3 vezes para desbloqueá-la, gastando 3 turnos",
    warning: "Ao usar esse poder, você perde permanentemente o controle da célula bloqueada; somente o adversário poderá liberá-la."
  },
  {
    power: "UNBLOCK",
    description: "Desbloqueia imediatamente uma célula que foi bloqueada pelo adversário, sem precisar esperar os 3 turnos necessários para removê-la manualmente.",
    warning: null
  },
  {
    power: "TRAP",
    description: "Coloca uma armadilha invisível em uma célula. Quando o adversário clicar nessa célula, ele perde automaticamente o turno.",
    warning: "O jogador que colocou a armadilha ainda pode revelar normalmente a célula armadilhada."
  },
  {
    power: "DETECT_TRAPS",
    description: "Revela todas as células que possuem armadilhas colocadas pelo adversário.",
    warning: null
  },
  {
    power: "FREEZE",
    description: "Aplica o efeito de congelamento no adversário, fazendo-o perder 3 turnos consecutivos.",
    warning: "Se o adversário tiver os poderes UNFREEZE ou IMMUNITY, ele pode remover o efeito imediatamente."
  },
  {
    power: "UNFREEZE",
    description: "Remove instantaneamente o efeito de congelamento aplicado pelo poder FREEZE.",
    warning: null
  },
  {
    power: "SPY",
    description: "Revela temporariamente o conteúdo de uma célula sem que o adversário saiba.",
    warning: "A célula não é revelada de verdade; portanto, qualquer efeito interno — como ativar um poder ou mostrar uma palavra — só ocorrerá quando a célula for revelada de fato."
  },
  {
    power: "BLIND",
    description: "Aplica cegueira no adversário, impedindo-o de ver o conteúdo das células reveladas durante os próximos 3 turnos.",
    warning: "Mesmo sem ver as letras, o adversário ainda recebe os poderes das células reveladas e continua desbloqueando palavras normalmente."
  },
  {
    power: "LANTERN",
    description: "Remove instantaneamente o efeito de cegueira, fazendo o adversário voltar a enxergar todas as células que estavam ocultas.",
    warning: null
  },
  {
    power: "IMMUNITY",
    description: "Concede imunidade por 5 turnos. Durante esse período, qualquer poder negativo usado pelo adversário não terá efeito.",
    warning: null
  },
];