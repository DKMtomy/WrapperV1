import { Player } from '../player/index';
import { Player as IPlayer } from '@minecraft/server';

export interface ClientEvents {
    OnChat: [OnChatEvent];
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
    /**
     * Send the message to the targets.
     *
     */
    setTargets(players: Player[]): void;
    /**
     * Get the targets the message will be sent to.
     * @returns Array of players.
     */
    getTargets(): Player[];
    /**
     * Send the message to the targets.
     */
    sendToTargets: boolean;
}

/**
 * Noop Cancel Method
 */
export type CancelMethod = () => void;
