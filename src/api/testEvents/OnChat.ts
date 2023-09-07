// Normal imports.
import AbstractEvent from './AbstractEvent';
import { setProto } from '../decorators/setProto';
import { ChatSendBeforeEvent, world, Player as IPlayer } from '@minecraft/server';

// Type imports.
import type { Client, Client2 } from '../client';
import { Player } from '../player/index';

/**
 * BeAPI chat event. Contains the logic
 * for translating Minecraft event data to BeAPI
 * wrapped data.
 */
export class OnChat extends AbstractEvent {
    // Predefined in AbstractEvent.
    protected readonly _logic = this.__logic.bind(this);
    // Predefined in AbstractEvent.
    protected readonly _client: Client2;
    // Predefined in AbstractEvent.
    protected _registered = false;

    // Predefined in AbstractEvent.
    public readonly name = 'OnChat';

    // Predefined in AbstractEvent.
    public readonly iName = 'chatSend';

    // Predefined in AbstractEvent.
    public readonly alwaysCancel = false;

    /**
     * BeAPI chat event. Contains the logic
     * for translating Minecraft event data to BeAPI
     * wrapped data.
     * @param client Client referece.
     */
    public constructor(client: Client2) {
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
        const sender = new Player(arg.sender);

        if (!sender) return;

        this._client.emit(this.name, {
            sender,
            message: arg.message,
            cancel: () => {
                arg.cancel = true;
            },
            setTargets(players: Player[]) {
                arg.setTargets(players.map(player => player._IPlayer2));
            },
            getTargets() {
                return arg.getTargets().map(player => new Player(player));
            },
            sendToTargets: arg.sendToTargets
        });
    }
}
