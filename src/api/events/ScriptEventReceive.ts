// Normal imports.
import AbstractEvent from './AbstractEvent';
import {
    Player as IPlayer,
    system,
    ScriptEventCommandMessageAfterEvent,
    Entity as IEntity
} from '@minecraft/server';

// Type imports.
import type { Client } from '../client';
import { Block } from '../block/Block';
import { Player } from '../player/Player';
import { Entity } from '../entity/Entity';

/**
 * CraftedAPI join event. Contains the logic
 * for translating Minecraft event data to CraftedAPI
 * wrapped data.
 */
export class ScriptEventReceive extends AbstractEvent {
    // Predefined in AbstractEvent.
    protected readonly _logic = this.__logic.bind(this);
    // Predefined in AbstractEvent.
    protected readonly _client: Client;
    // Predefined in AbstractEvent.
    protected _registered = false;

    // Predefined in AbstractEvent.
    public readonly name = 'scriptEventReceived';

    // Predefined in AbstractEvent.
    public readonly iName = 'custom';

    // Predefined in AbstractEvent.
    public readonly alwaysCancel = false;

    /**
     * CraftedAPI join event. Contains the logic
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
            system.afterEvents.scriptEventReceive.subscribe(this._logic);
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
            system.afterEvents.scriptEventReceive.unsubscribe(this._logic);
            // Set registered to false so this cannot be called
            // Again before on being called.
            this._registered = false;
        }
    }

    // Predefined in AbstractEvent.
    protected __logic(arg: ScriptEventCommandMessageAfterEvent): void {
        //check if the source entity is a player if so then create a player object using our wrapper

        const entity =
            arg.sourceEntity instanceof IPlayer
                ? new Player(arg.sourceEntity, this._client)
                : arg.sourceEntity instanceof IEntity
                ? new Entity(arg.sourceEntity, this._client)
                : undefined;

        //@ts-expect-error
        this._client.emit(this.name, {
            id: arg.id,
            initiator: arg.initiator,
            sourceBlock: new Block(this._client, arg.sourceBlock),
            message: arg.message,
            sourceType: arg.sourceType,
            sourceEntity: entity
        });
    }
}
