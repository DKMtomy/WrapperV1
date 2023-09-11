import { Block, Entity, Player } from '..';
import { Dimension, Player as IPlayer, ItemStack } from '@minecraft/server';
import { BlockCreated } from '../testEvents/BlockCreated';

export interface ClientEvents {
    OnChat: [OnChatEvent];
    playerUseItem: [ItemUseEvent];
    blockCreated: [BlockCreatedEvent];
    OnJoin: [Player];
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
    item: ItemStack;
    /**
     * Stop event from occuring.
     */
    cancel: CancelMethod;
}

/**
 * Noop Cancel Method
 */
export type CancelMethod = () => void;
