// Regular imports.
import AbstractEvent from './AbstractEvent';
import { PlayerPlaceBlockBeforeEvent, world } from '@minecraft/server';

// Type imports.
import type { Client } from '../client';
import { Block } from '../block/Block';
import { Item } from '../item/index';

/**
 * CraftedAPI block created event. Contains the logic
 * for translating Minecraft event data to CraftedAPI
 * wrapped data.
 */
export class BlockCreated extends AbstractEvent {
    // Predefined in AbstractEvent.
    protected readonly _logic = this.__logic.bind(this);
    // Predefined in AbstractEvent.
    protected readonly _client: Client;
    // Predefined in AbstractEvent.
    protected _registered = false;

    // Predefined in AbstractEvent.
    public readonly name = 'BlockCreated';

    // Predefined in AbstractEvent.
    public readonly iName = 'playerPlaceBlock';

    // Predefined in AbstractEvent.
    public readonly alwaysCancel = false;

    /**
     * CraftedAPI block created event. Contains the logic
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

    // Predefined in AbstractEvent.
    protected __logic(arg: PlayerPlaceBlockBeforeEvent): void {
        // Attempt to get the player who created the block.
        const player = this._client.players.getByIPlayer(arg.player);
        // If not player could be found return.
        if (!player) return;

        // Emit this event on client using name defined above.
        this._client.emit(this.name, {
            player: player,
            block: new Block(this._client, arg.block),
            face: arg.face,
            faceLocation: arg.faceLocation,
            item: new Item(this._client, arg.itemStack),
            dimension: arg.dimension,
            cancel() {
                arg.cancel = true
            }
        });
    }
}
