enum LogEnum {
    RoomCreated = "room created",
    RoomClosed = "room closed",
    PlayerJoined = "joined the game",
    PlayerJoinedAsSpectator = "joined as spectator",
    PlayerReconnected = "reconnected to the game",
    PlayerTurnedToSpectator = "turned to spectator",
    SpectatorTurnedToPlayer = "turned to player",
    PlayerKicked = "was kicked",
    PlayerBanned = "was banned",
    PlayerUnbanned = "was unnbanned",
    SwapSlot = "swaped slot",
    PlayerLeft = "left the game",
    GameStarted = "game started",
    GameOver = "game over",
    Error = "error",
    InvalidMovement = "tried an invalid movement",

    Freeze = "froze",
    Unfreeze = "unfroze",
    Trapped = "trapped cell at",
    Detect = "detected traps",
    Blocked = "blocked cell at",
    Unblocked = "unblocked cell at",
    ClickOn = "clicked on cell at",
    Spied = "spied cell at",
    Blinded = "blinded",
    Lantern = "used lantern",
    Immunity = "became immune"
}

export { LogEnum }