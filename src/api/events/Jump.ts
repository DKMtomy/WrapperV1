// Normal imports.
import AbstractEvent from './AbstractEvent';

// Type imports.
import type { Client } from '../client';
import { scriptEventReceiveEvent } from '../types/Client';

/**
 * BeAPI jump event. Contains the logic
 * for translating Minecraft event data to BeAPI
 * wrapped data.
 */
export class Jump extends AbstractEvent {
    // Predefined in AbstractEvent.
    protected readonly _logic = this.__logic.bind(this);
    // Predefined in AbstractEvent.
    protected readonly _client: Client;
    // Predefined in AbstractEvent.
    protected _registered = false;

    // Predefined in AbstractEvent.
    public readonly name = 'Jump';

    // Predefined in AbstractEvent.
    public readonly iName = 'custom';

    // Predefined in AbstractEvent.
    public readonly alwaysCancel = false;

    /**
     * BeAPI jump event. Contains the logic
     * for translating Minecraft event data to BeAPI
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
            // Subscribe to Client event with needed logic
            // And use bound _logic for the callback.
            this._client.addListener('scriptEventReceived', this._logic);
            // Set registered to true so this cannot be called
            // Again before off being called.
            this._registered = true;
        }
    }

    // Predefined in AbstractEvent.
    public off(): void {
        // If currently registered.
        if (this._registered) {
            // Remove Client event listener used
            // With bound _logic callback.
            this._client.removeListener('scriptEventReceived', this._logic);
            // Set registered to false so this cannot be called
            // Again before on being called.
            this._registered = false;
        }
    }

    // Predefined in AbstractEvent.
    protected __logic(data: scriptEventReceiveEvent): void {
        // If not correct tag return.
        if (data.id !== 'CraftedAPI:jump') return;

        // Emit jump event client.
        this._client.emit(this.name, data.sourceEntity);
    }
}
