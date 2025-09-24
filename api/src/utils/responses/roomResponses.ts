enum RoomResponses {
    RoomCreated = "room_created",
    RoomCreationFailed = "room_creation_failed",
    RoomJoined = "room_joined",
    RoomJoinedAsSpectator = "room_joined_as_spectator",
    RoomTurnedToPlayer = "room_turned_to_player",
    RoomTurnedToSpectator = "room_turned_to_spectator",
    RoomSettingsChanged = "room_settings_changed",
    SpectatorsOff = "spectators_off",
    PlayerReconnected = "player_reconnected",
    RoomFound = "room_found",
    FullRoom = "full_room",
    LeftRoom = "left_room",
    PublicRooms = "public_rooms",
    DataError = "data_error"
}

export { RoomResponses }