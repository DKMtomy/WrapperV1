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
    Container,
    ScreenDisplay,
    DimensionLocation,
    PlayerSoundOptions,
    RawMessage,
    EntityLifetimeState,
    EntityApplyDamageByProjectileOptions,
    EntityApplyDamageOptions,
    EntityComponent,
    BlockRaycastOptions,
    BlockRaycastHit,
    EntityRaycastOptions,
    EntityRaycastHit,
    PlayAnimationOptions,
    TeleportOptions
} from '@minecraft/server';

import { Entity } from '../entity/index';
import { Client, Gamemode, titleTypes } from '../index';

/**
 * Wraps an IPlayer object and provides additional functionality.
 */
export class Player extends Entity {
    /**
     * The IPlayer object being wrapped.
     */
    private readonly _IPlayer: IPlayer;

    protected readonly _client: Client;

    /**
     * Creates a new Player instance.
     * @param IPlayer The IPlayer object to wrap.
     */
    constructor(IPlayer: IPlayer, client?: Client) {
        super(IPlayer, client);
        this._IPlayer = IPlayer;
        this._client = client;
    }

    /**
     * Gets the players Minecraft Mojang IPlayer object.
     * @returns
     */
    public getIPlayer(): IPlayer {
        return this._IPlayer;
    }

    /**
     * Gets the players ID *(non persistant)*.
     * @returns
     */
    public getId(): string {
        return this._IPlayer.id;
    }

    /**
     * Sets the players name tag *(display name)*.
     * @param nametag Display name to set.
     */
    public setNameTag(nametag: string): void {
        this._IPlayer.nameTag = nametag;
    }

    /**
     * Sends action bar text to the player.
     * @param message Message content to set.
     */
    public sendActionbar(message: string): void {
        const display = this._IPlayer.onScreenDisplay;
        display.setActionBar(message);
    }

    /**
     * Attempts to set the score of the player on an objective.
     * @param objective Objective to use.
     * @param amount New score.
     * @returns
     */
    public setScore(objective: string, amount: number): number {
        this.executeCommand(`scoreboard players set @s "${objective}" ${amount}`);

        return this.getScore(objective);
    }

    /**
     * Attempts to add score to the player on an objective.
     * @param objective Objective to use.
     * @param amount Amount to add.
     * @returns
     */
    public addScore(objective: string, amount: number): number {
        this.executeCommand(`scoreboard players add @s "${objective}" ${amount}`);

        return this.getScore(objective);
    }

    /**
     * Attempts to remove score from the player on an objective.
     * @param objective Objective to use.
     * @param amount Amount to remove.
     * @returns
     */
    public removeScore(objective: string, amount: number): number {
        this.executeCommand(`scoreboard players remove @s "${objective}" ${amount}`);

        return this.getScore(objective);
    }

    public get isClimbing(): boolean {
        return this._IPlayer.isClimbing;
    }

    public get dimension(): Dimension {
        return this._IPlayer.dimension;
    }

    public get fallDistance(): number {
        return this._IPlayer.fallDistance;
    }

    public get id(): string {
        return this._IPlayer.id;
    }

    public get isFalling(): boolean {
        return this._IPlayer.isFalling;
    }

    public get isInWater(): boolean {
        return this._IPlayer.isInWater;
    }

    public get isOnGround(): boolean {
        return this._IPlayer.isOnGround;
    }

    public get isSprinting(): boolean {
        return this._IPlayer.isSprinting;
    }

    public get isSwimming(): boolean {
        return this._IPlayer.isSwimming;
    }

    public get lifetimeState(): EntityLifetimeState {
        return this._IPlayer.lifetimeState;
    }

    public get location(): Vector3 {
        return this._IPlayer.location;
    }

    public get nameTag(): string {
        return this._IPlayer.nameTag;
    }

    public get target(): IEntity | Entity | undefined {
        return this._IPlayer.target;
    }

    public get typeId(): string {
        return this._IPlayer.typeId;
    }

    public applyDamage(
        amount: number,
        options?: EntityApplyDamageByProjectileOptions | EntityApplyDamageOptions
    ): boolean {
        return this._IPlayer.applyDamage(amount, options);
    }

    public applyImpulse(vector: Vector3): void {
        this._IPlayer.applyImpulse(vector);
    }

    public applyKnockback(
        directionX: number,
        directionZ: number,
        horizontalStrength: number,
        verticalStrength: number
    ): void {
        this._IPlayer.applyKnockback(directionX, directionZ, horizontalStrength, verticalStrength);
    }

    public getName(): string {
        return this._IPlayer.name;
    }

    public clearVelocity(): void {
        this._IPlayer.clearVelocity();
    }

    public extinguishFire(useEffects?: boolean): boolean {
        return this._IPlayer.extinguishFire(useEffects);
    }

    public getBlockFromViewDirection(options?: BlockRaycastOptions): BlockRaycastHit | undefined {
        return this._IPlayer.getBlockFromViewDirection(options);
    }

    public getComponent(componentId: string): EntityComponent | undefined {
        return this._IPlayer.getComponent(componentId);
    }

    public getComponents(): EntityComponent[] {
        return this._IPlayer.getComponents();
    }

    public getEntitiesFromViewDirection(options?: EntityRaycastOptions): EntityRaycastHit[] {
        return this._IPlayer.getEntitiesFromViewDirection(options);
    }

    public getDynamicProperty(identifier: string): boolean | number | string | undefined {
        return this._IPlayer.getDynamicProperty(identifier);
    }

    public getEffect(effectType: EffectType): Effect | undefined {
        return this._IPlayer.getEffect(effectType);
    }

    public getEffects(): Effect[] {
        return this._IPlayer.getEffects();
    }

    public hasComponent(componentId: string): boolean {
        return this._IPlayer.hasComponent(componentId);
    }

    public isValid(): boolean {
        return this._IPlayer.isValid();
    }

    public kill(): void {
        this._IPlayer.kill();
    }

    public playAnimation(animationName: string, options?: PlayAnimationOptions): void {
        this._IPlayer.playAnimation(animationName, options);
    }

    public removeDynamicProperty(identifier: string): boolean {
        return this._IPlayer.removeDynamicProperty(identifier);
    }

    public removeEffect(effectType: EffectType): boolean {
        return this._IPlayer.removeEffect(effectType);
    }

    public runCommand(command: string): CommandResult {
        return this._IPlayer.runCommand(command);
    }

    public setDynamicProperty(identifier: string, value: boolean | number | string): void {
        return this._IPlayer.setDynamicProperty(identifier, value);
    }

    public tryTeleport(location: Vector3, teleportOptions?: TeleportOptions): boolean {
        return this._IPlayer.tryTeleport(location, teleportOptions);
    }

    public setOnFire(seconds: number, useEffects?: boolean): boolean {
        return this._IPlayer.setOnFire(seconds, useEffects);
    }

    public get isFlying(): boolean {
        return this._IPlayer.isFlying;
    }

    public get isGliding(): boolean {
        return this._IPlayer.isGliding;
    }

    public get isJumping(): boolean {
        return this._IPlayer.isJumping;
    }

    public get level(): number {
        return this._IPlayer.level;
    }

    public get name(): string {
        return this._IPlayer.name;
    }

    public get onScreenDisplay(): ScreenDisplay {
        return this._IPlayer.onScreenDisplay;
    }

    public get selectedSlot(): number {
        return this._IPlayer.selectedSlot;
    }

    public set selectedSlot(slot: number) {
        this._IPlayer.selectedSlot = slot;
    }

    public get totalXpNeededForNextLevel(): number {
        return this._IPlayer.totalXpNeededForNextLevel;
    }

    public get xpEarnedAtCurrentLevel(): number {
        return this._IPlayer.xpEarnedAtCurrentLevel;
    }

    public addExperience(amount: number): number {
        return this._IPlayer.addExperience(amount);
    }

    public addLevels(amount: number): number {
        return this._IPlayer.addLevels(amount);
    }

    public getItemCooldown(itemCategory: string): number {
        return this._IPlayer.getItemCooldown(itemCategory);
    }

    public getSpawnPoint(): DimensionLocation | undefined {
        return this._IPlayer.getSpawnPoint();
    }

    public getTotalXp(): number {
        return this._IPlayer.getTotalXp();
    }

    public runCommandAsync(command: string): void {
        this._IPlayer.runCommandAsync(command);
    }

    public isOp(): boolean {
        return this._IPlayer.isOp();
    }

    public playSound(soundID: string, soundOptions?: PlayerSoundOptions): void {
        this._IPlayer.playSound(soundID, soundOptions);
    }

    public postClientMessage(id: string, value: string): void {
        this._IPlayer.postClientMessage(id, value);
    }

    public resetLevel(): void {
        this._IPlayer.resetLevel();
    }

    public sendMessage(message: (RawMessage | string)[] | RawMessage | string): void {
        this._IPlayer.sendMessage(message);
    }

    public setOp(isOp: boolean): void {
        this._IPlayer.setOp(isOp);
    }

    public setSpawnPoint(spawnPoint?: DimensionLocation): void {
        this._IPlayer.setSpawnPoint(spawnPoint);
    }

    public startItemCooldown(itemCategory: string, tickDuration: number): void {
        this._IPlayer.startItemCooldown(itemCategory, tickDuration);
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
    public getGamemode(): Gamemode {
        const gmc = this._client.executeCommand(`testfor @a[name="${this.getNameTag()}",m=c]`, this.getDimension().id);
        const gma = this._client.executeCommand(`testfor @a[name="${this.getNameTag()}",m=a]`, this.getDimension().id);
        const gms = this._client.executeCommand(`testfor @a[name="${this.getNameTag()}",m=s]`, this.getDimension().id);
        if (!gmc.err) return Gamemode.creative;
        if (!gma.err) return Gamemode.adventure;
        if (!gms.err) return Gamemode.survival;

        return Gamemode.unknown;
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
