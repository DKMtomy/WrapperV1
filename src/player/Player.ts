import {
    Effect,
    EffectType,
    EntityHealthComponent,
    EntityInventoryComponent,
    Vector,
    CommandResult,
    world,
    Vector3,
    Dimension,
    EntityEquipmentInventoryComponent,
    EquipmentSlot,
    ContainerSlot,
    Vector2,
    ItemStack,
    ItemComponent,
    Player as IPlayer,
    Entity as IEntity,
    Container
} from '@minecraft/server';

import { Entity } from '../entity/index';
import { Gamemode, titleTypes } from '../types/playerStuff';

/**
 * Wraps an IPlayer object and provides additional functionality.
 */
export class Player extends Entity {
    /**
     * The IPlayer object being wrapped.
     */
    private readonly _IPlayer: IPlayer;

    /**
     * Creates a new Player instance.
     * @param IPlayer The IPlayer object to wrap.
     */
    constructor(IPlayer: IPlayer) {
        super(IPlayer);
        this._IPlayer = IPlayer;
    }

    /**
     * Gets the IEntity object associated with this player.
     * @returns The IEntity object.
     */
    public getIEntity(): IEntity {
        return this._IPlayer;
    }

    /**
     * Gets the player's current gamemode.
     * @returns A promise that resolves to the player's gamemode.
     */
    public async getGamemode(): Promise<string | undefined> {
        const gamemodeCommands = [
            `testfor @s[m=${Gamemode.survival}]`,
            `testfor @s[m=${Gamemode.creative}]`,
            `testfor @s[m=${Gamemode.adventure}]`,
            `testfor @s[m=${Gamemode.spectator}]`
        ];

        for (const command of gamemodeCommands) {
            try {
                await this._IPlayer.runCommandAsync(command);
                return command.split('=')[1];
            } catch (error) {
                // Ignore errors and try the next command.
            }
        }

        return undefined;
    }

    /**
     * Clears the player's respawn point.
     */
    public clearRespawnPoint(): void {
        this._IPlayer.runCommandAsync('clearspawnpoint @s');
    }

    /**
     * Clears the player's title.
     */
    public clearTitle(): void {
        this._IPlayer.runCommandAsync('/title @s clear');
    }

    /**
     * Sets the player's gamemode.
     * @param gamemode The gamemode to set.
     */
    public setGamemode(gamemode: Gamemode): void {
        this._IPlayer.runCommand(`gamemode ${gamemode} @s`);
    }

    /**
     * Sends a display message to the player.
     * @param message The message to display.
     * @param type The type of message to display.
     */
    public sendDisplay(message: string, type: titleTypes): void {
        this._IPlayer.runCommand(`title @s ${type} ${message}`);
    }

    /**
     * Gets the player's equipment inventory.
     * @returns The player's equipment inventory.
     */
    public getEquipment(): EntityEquipmentInventoryComponent {
        return this._IPlayer.getComponent(
            EntityEquipmentInventoryComponent.componentId
        ) as EntityEquipmentInventoryComponent;
    }

    /**
     * Gets the player's inventory container.
     * @returns The player's inventory container.
     */
    public getContainer(): Container {
        return this.getInventory().container as Container;
    }

    /**
     * Adds experience points to the player.
     * @param amount The amount of experience points to add.
     */
    public addXp(amount: number): void {
        if (!Number.isSafeInteger(amount)) {
            throw new Error('amount must be a safe integer');
        }

        this._IPlayer.runCommandAsync(`xp ${amount} @s`);
    }

    /**
     * Adds experience levels to the player.
     * @param amount The amount of experience levels to add.
     */
    public addXpLevels(amount: number): void {
        if (!Number.isSafeInteger(amount)) {
            throw new Error('amount must be a safe integer');
        }

        this._IPlayer.runCommandAsync(`xp ${amount}L @s`);
    }

    /**
     * Removes experience points from the player.
     * @param amount The amount of experience points to remove.
     */
    public removeXp(amount: number): void {
        if (!Number.isSafeInteger(amount)) {
            throw new Error('amount must be a safe integer');
        }

        this._IPlayer.runCommandAsync(`xp -${amount} @s`);
    }

    /**
     * Removes experience levels from the player.
     * @param amount The amount of experience levels to remove.
     */
    public removeXpLevels(amount: number): void {
        if (!Number.isSafeInteger(amount)) {
            throw new Error('amount must be a safe integer');
        }

        this._IPlayer.runCommandAsync(`xp -${amount}L @s`);
    }

    /**
     * Resets the player's experience levels.
     */
    public resetXpLevels(): void {
        this._IPlayer.runCommandAsync(`xp -9999999L @s`);
    }

    /**
     * Sets the player's title.
     * @param text The text to display in the title.
     * @param options Additional options for the title.
     */
    public setTitle(text: string, options: Partial<import('@minecraft/server').TitleDisplayOptions> = {}): void {
        if (!text) {
            throw new Error('text must be defined');
        }

        const { subtitle, fadeInDuration, fadeOutDuration, stayDuration } = options;

        this._IPlayer.runCommand(`titleraw @s title {"rawtext":[{"text":"${text}"}]}`);

        if (subtitle) {
            this._IPlayer.runCommand(`titleraw @s subtitle {"rawtext":[{"text":"${subtitle}"}]}`);
        }

        if (fadeInDuration || fadeOutDuration || stayDuration) {
            this._IPlayer.runCommand(
                `titleraw @s times ${fadeInDuration ?? 0} ${stayDuration ?? 999999999} ${fadeOutDuration ?? 0}`
            );
        }
    }

    /**
     * Updates the player's subtitle.
     * @param text The text to display in the subtitle.
     */
    public updateSubtitle(text: string): void {
        if (!text) {
            throw new Error('text must be defined');
        }

        this._IPlayer.runCommand(`titleraw @s subtitle {"rawtext":[{"text":"${text}"}]}`);
    }

    /**
     * Sets the player's action bar text.
     * @param text The text to display in the action bar.
     */
    public setActionBar(text: string): void {
        if (!text) {
            throw new Error('text must be defined');
        }

        this._IPlayer.runCommand(`titleraw @s actionbar {"rawtext":[{"text":"${text}"}]}`);
    }

    /**
     * Clears the player's inventory.
     */
    public clearInventory(): void {
        this._IPlayer.runCommand(`clear @s`);
    }
}
