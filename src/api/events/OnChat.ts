// Normal imports.
import AbstractEvent from './AbstractEvent';
import { setProto } from '../decorators/setProto';
import { ChatSendBeforeEvent, world, Player as IPlayer } from '@minecraft/server';

// Type imports.
import type { Client } from '../client';
import { Player } from '../player/index';

/**
 * CraftedAPI chat event. Contains the logic
 * for translating Minecraft event data to CraftedAPI
 * wrapped data.
 */
export class OnChat extends AbstractEvent {
    // Predefined in AbstractEvent.
    protected readonly _logic = this.__logic.bind(this);
    // Predefined in AbstractEvent.
    protected readonly _client: Client;
    // Predefined in AbstractEvent.
    protected _registered = false;

    // Predefined in AbstractEvent.
    public readonly name = 'OnChat';

    // Predefined in AbstractEvent.
    public readonly iName = 'chatSend';

    // Predefined in AbstractEvent.
    public readonly alwaysCancel = false;

    /**
     * CraftedAPI chat event. Contains the logic
     * for translating Minecraft event data to CraftedAPI
     * wrapped data.
     * @param client Client referece.
     */
    public constructor(client: Client) {
        super();
        this._client = client;
    }

    // Predefined in AbstractEvent.
    public on(): void {
        // If not already registered.
        if (!this._registered) {
            // Subscribe to Minecraft world event with IName
            // And use bound _logic for the callback.
            world.beforeEvents[this.iName].subscribe(this._logic);
            // Set registered to true so this cannot be called
            // Again before off being called.
            this._registered = true;
        }
    }

    // Predefined in AbstractEvent.
    public off(): void {
        // If currently registered.
        if (this._registered) {
            // Remove Minecraft event listener on IName
            // With bound _logic callback.
            world.beforeEvents[this.iName].unsubscribe(this._logic);
            // Set registered to false so this cannot be called
            // Again before on being called.
            this._registered = false;
        }
    }

    protected __logic(arg: ChatSendBeforeEvent): void {
        const sender = new Player(arg.sender, this._client);

        if (!sender) return;

        this._client.emit(this.name, {
            sender,
            message: arg.message,
            cancel: () => {
                arg.cancel = true;
            }
        });
    }
}
