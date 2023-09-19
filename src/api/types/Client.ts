import { Dimension, ScriptEventSource } from '@minecraft/server';
import { Block } from '../block/Block';
import { Player } from '../player/Player';
import { Item } from '../item/item';
import { Entity } from '../entity/Entity';

export interface ClientEvents {
    OnChat: [OnChatEvent];
    playerUseItem: [ItemUseEvent];
    BlockCreated: [BlockCreatedEvent];
    OnJoin: [Player];
    Tick: [TickEvent];
    scriptEventReceived: [scriptEventReceiveEvent];
    Jump: [Entity | Player | undefined];
    Land: [Entity | Player | undefined];
    StartedMoving: [Entity | Player | undefined];
    StoppedMoving: [Entity | Player | undefined];
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

export interface scriptEventReceiveEvent {
    /**
     * Identifier of this ScriptEvent command message.
     */
    id: string;
    /**
     * If this command was initiated via an NPC, returns the entity
     * that initiated the NPC dialogue.
     *
     */
    initiator: Entity;
    /**
     * Source block if this command was triggered via a block
     * (e.g., a commandblock.)
     *
     */
    sourceBlock: Block;
    /**
     * Optional additional data passed in with the script event
     * command.
     */
    message: string;
    /**
     * Returns the type of source that fired this command.
     *
     */
    sourceType: ScriptEventSource;
    /**
     * Source entity if this command was triggered by an entity
     * (e.g., a NPC).
     *
     */
    sourceEntity: Entity | Player | undefined;
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
