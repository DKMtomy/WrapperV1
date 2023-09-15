// Normal imports.
import AbstractEvent from './AbstractEvent';

// Type imports.
import type { Client } from '../client';
import { world, system } from '@minecraft/server';

/**
 * BeAPI tick event. Contains the logic
 * for translating Minecraft event data to BeAPI
 * wrapped data.
 */
export class Tick extends AbstractEvent {
    // Predefined in AbstractEvent.
    protected readonly _logic = this.__logic.bind(this);
    // Predefined in AbstractEvent.
    protected readonly _client: Client;
    // Predefined in AbstractEvent.
    protected _registered = false;

    // Predefined in AbstractEvent.
    public readonly name = 'Tick';

    // Predefined in AbstractEvent.
    public readonly iName = 'custom';

    // Predefined in AbstractEvent.
    public readonly alwaysCancel = false;

    private interval: number;

    // Current tick of the server.
    protected currentTick = 0;

    /**
     * BeAPI tick event. Contains the logic
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
            // Subscribe to Minecraft world event with IName
            // And use bound _logic for the callback.
            this.interval = system.runInterval(() => {
                this._logic();
            }, 0);
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
            system.clearRun(this.interval);
            // Set registered to false so this cannot be called
            // Again before on being called.
            this._registered = false;
        }
    }

    // Predefined in AbstractEvent.
    protected __logic(): void {
        // Set the current tick.
        this.currentTick = system.currentTick;

        // Emit the event through client.
        this._client.emit(this.name, {
            currentTick: system.currentTick
        });
    }

    /**
     * Get the current tick of the world
     */
    public getCurrentTick(): number {
        return this.currentTick;
    }
}
