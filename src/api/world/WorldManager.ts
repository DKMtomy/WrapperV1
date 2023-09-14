import type { Client } from '../client';

import {
    World as IWorld,
    world,
    Dimension as IDimension,
    ItemStack,
    MinecraftItemTypes,
    WorldSoundOptions as ISoundOptions,
    MusicOptions as IMusicOptions
} from '@minecraft/server';
import { DimensionNamespace } from '../types/Dimension';
import { Dimension } from './Dimension';
import { Weather } from '../types/World';
export class WorldManager {
    /**
     * Private client reference.
     */
    protected readonly _client: Client;

    /**
     * Private world reference.
     */
    protected readonly _IWorld: IWorld;

    protected readonly _dimensions = new Map<DimensionNamespace, Dimension>();

    public constructor(client: Client) {
        // Assign private client reference.
        this._client = client;
        // Assign private world reference.
        this._IWorld = world;
        // Add dimensions to the map.
        this._dimensions.set(
            'minecraft:overworld',
            new Dimension(this._client, this._IWorld.getDimension('overworld'))
        );
        this._dimensions.set('minecraft:nether', new Dimension(this._client, this._IWorld.getDimension('nether')));
        this._dimensions.set('minecraft:the_end', new Dimension(this._client, this._IWorld.getDimension('the end')));
    }

    /**
     * Get the vanilla world instance.
     * @returns Vanilla world instance.
     */
    public getIWorld(): IWorld {
        return this._IWorld;
    }

    /**
     * Broadcasts a message to everyone.
     * @param {string} message Message to send.
     */
    public sendMessage(message: string): void {
        this._IWorld.sendMessage(message);
    }

    /**
     * Gets a world dimension by its name.
     * @param {Dimension} dimension World dimension to use.
     * @returns {IDimension}
     */
    public getDimension(dimension: DimensionNamespace | IDimension | string): Dimension {
        if (typeof dimension === 'string') return this._dimensions.get(dimension as DimensionNamespace)!;
        if (dimension instanceof IDimension) {
            return this._dimensions.get(dimension.id as DimensionNamespace)!;
        }
        return this._dimensions.get(dimension)!;
    }

    /**
     * Attempts to get the world time by using `/time query daytime`.
     *
     * WARNING: Changes to this commands response in language files could
     * break its functionality.
     * @returns {number}
     */
    public getTime(): number {
        return this._IWorld.getTimeOfDay();
    }

    /**
     * Attempts to set the time to the given value.
     * @param {number} time New time to set.
     * @returns {boolean} `true` means successful
     */
    public setTime(time: number): void {
        return this._IWorld.setTimeOfDay(time);
    }

    /**
     * Attempts to get the weather by using `/weather query`.
     *
     * WARNING: Changes to this commands response in language files could
     * break its functionality.
     * @returns {Weather}
     */
    public getWeather(): Weather {
        const command = this._client.executeCommand('weather query');
        if (command.err) return 'clear';

        // return command.statusMessage.split(' ')[3] as Weather;
    }
}
