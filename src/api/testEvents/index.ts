import { BlockCreated } from "./BlockCreated"
import { ItemUse } from "./ItemUse"
import { OnChat } from "./OnChat"
import { OnJoin } from "./OnJoin"
import { Tick } from "./Tick"

export const events = [
    OnChat,
    ItemUse,
    BlockCreated,
    OnJoin,
    Tick
]