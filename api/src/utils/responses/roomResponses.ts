enum RoomResponses {
    RoomCreated = "room_created",
    RoomCreationFailed = "room_creation_failed",
    RoomJoined = "room_joined",
    RoomJoinedAsSpectator = "room_joined_as_spectator",
    RoleChanged = "role_changed",
    RoomSettingsChanged = "room_settings_changed",
    SpectatorsOff = "spectators_off",
    PlayerReconnected = "player_reconnected",
    RoomFound = "room_found",
    FullRoom = "full_room",
    LeftRoom = "left_room",
    RoomClosed = "room_closed",
    PublicRooms = "public_rooms",
    InvalidSlot = "invalid_slot",
    DataError = "data_error"
}

export { RoomResponses }