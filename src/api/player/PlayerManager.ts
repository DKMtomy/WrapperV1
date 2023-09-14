import { Player } from './Player';

import { world, type Player as IPlayer } from '@minecraft/server';
import type { Client } from '../client';

export class PlayerManager {
    /**
     * Protected player map.
     */
    protected readonly _players = new Map<string, Player>();
    /**
     * Protected client circular reference.
     */
    protected readonly _client: Client;

    /**
     * Player manager is the main hub for interacting with
     * players inside the world currently.
     * @param client Client reference.
     */
    public constructor(client: Client) {
        this._client = client;

        world.getPlayers().forEach(player => {
            if (!this._players.has(player.name)) this.add(this.create(player));
        });
    }

    /**
     * Adds a player to the player manager.
     * @param player Player to add.
     */
    public add(player: Player): void {
        this._players.set(player.getName(), player);
    }

    /**
     * Creates a new player from a Minecraft IPlayer.
     * @param player IPlayer object.
     * @returns
     */
    public create(player: IPlayer): Player {
        return new Player(player, this._client);
    }

    /**
     * Removes a player from the player manager.
     *
     * WARNING: Please do not remove players this way.
     * If you want to remove a player, get them and call
     * `Player.destroy()`! Removing them this way
     * when they are still in the world will
     * most likely cause issues.
     *
     * @param player Player to remove.
     * @param name Name of player to remove.
     */
    public removePlayer(playerOrName: Player | string) {
        const name = typeof playerOrName === 'string' ? playerOrName : playerOrName.getName();

        this._players.delete(name);
    }

    /**
     * Gets all players currently in the world
     * as a map.
     * @returns
     */
    public getAll(): Player[] {
        return Array.from(this._players.values());
    }

    /**
     * Gets all players currently in the world
     * as an array.
     * @returns
     */
    public getAllAsArray(): Player[] {
        return Array.from(this.getAll().values());
    }

    /**
     * Attempts to get a player by their name.
     * @param playerName Name of the player.
     * @returns can return `undefined`
     */
    public getByName(playerName: string): Player | undefined {
        return this._players.get(playerName);
    }

    /**
     * Attempts to get a player by their name tag.
     * @param nameTag Name tag of player.
     * @returns can return `undefined`
     */
    public getByNameTag(nameTag: string): Player | undefined {
        return Array.from(this._players.values()).find(p => p.getNameTag() === nameTag);
    }

    /**
     * Attempts to get a player by their Minecraft IPlayer object.
     * @param IPlayer Minecraft IPlayer object.
     * @returns can return `undefined`
     */
    public getByIPlayer(IPlayer: IPlayer): Player | undefined {
        return Array.from(this._players.values()).find(p => p.getIPlayer() === IPlayer);
    }
}
