enum GameResponses {
    Revealed = "revealed",
    AlmostRevealed = "almost_revealed",
    GameError = "game_error",
    WithoutPower = "without_power",
    PowerDiscarded = "power_discarded",
    NotEnoughPlayers = "not_enough_players",
    GameStarted = "game_started",
    InvalidTurnAction = "invalid_turn_action",
    Continue = "continue",
    InvalidMovement = "invalid_movement",
    InvalidTheme = "invalid_theme",
    AlmostBlocked = "almost_blocked",
    Blocked = "blocked",
    Unblocked = "unblocked",
    Trapped = "trapped",
    TrapTrigged = "trap_trigged",
    AlmostTrapped = "almost_trapped",
    DetectedTraps = "detected_traps",
    Spied = "spied",
    Frozen = "frozen",
    Unfrozen = "unfrozen",
    PlayerFrozen = "player_frozen",
    Blinded = "player_blind",
    Lantern = "used_lantern",
    Immunity = "player_immune"
}

export { GameResponses }