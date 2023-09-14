import { Dimension, Player as IPlayer, ItemStack, Block as IBlock } from '@minecraft/server';
import { BlockCreated } from '../testEvents/BlockCreated';
import { Block } from '../block/Block';
import { Player } from '../player/Player';
import { Item } from '../item/item';

export interface ClientEvents {
    OnChat: [OnChatEvent];
    playerUseItem: [ItemUseEvent];
    BlockCreated: [BlockCreatedEvent];
    OnJoin: [Player];
    Tick: [TickEvent];
}

export interface OnChatEvent {
    /**
     * Player who sent the message.
     */
    sender: Player | undefined;
    /**
     * Message content.
     */
    message: string;
    /**
     * Stop event from occuring.
     */
    cancel: CancelMethod;
}

/**
 * Block created event trigger data.
 */
export interface BlockCreatedEvent {
    /**
     * Player who placed the block.
     */
    player: Player;
    /**
     * Block that was placed.
     */
    block: Block;
    /**
     * Dimension event occured in.
     */
    dimension: Dimension;
    /**
     * Stop event from occuring.
     */
    cancel: CancelMethod;
}

/**
 * Item used trigger data.
 */
export interface ItemUseEvent {
    /**
     * The player or entity or possibly nothing that used the item.
     */
    source: Player | undefined;
    /**
     * The item in question.
     */
    item: Item;
    /**
     * Stop event from occuring.
     */
    cancel: CancelMethod;
}

/**
 * Server tick iteration event data,
 */
export interface TickEvent {
    /**
     * Current tick number. Always increases.
     */
    currentTick: number;
}

/**
 * Noop Cancel Method
 */
export type CancelMethod = () => void;
