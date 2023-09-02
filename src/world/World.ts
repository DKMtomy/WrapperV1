import {
    Effect,
    EffectType,
    World as IWorld,
    Entity,
    EntityHealthComponent,
    EntityInventoryComponent,
    Vector,
    CommandResult,
    Vector3,
    Dimension,
    EntityEquipmentInventoryComponent,
    EquipmentSlot,
    ContainerSlot,
    Vector2,
    ItemStack,
    ItemComponent,
    WorldBeforeEvents,
    WorldAfterEvents,
    Scoreboard,
    EntityQueryOptions,
    MusicOptions,
    WorldSoundOptions,
    RawMessage,
    TimeOfDay
} from '@minecraft/server';

import { Vec3 } from '../vector/index';
import { Player } from '../player/index';

type PropertyValue = boolean | number | string | undefined;

export class world {
    [key: string]: any;

    /**
     * Protected IWorld object being wrapped.
     */
    protected readonly _IWorld: IWorld;

    constructor(IWorld: IWorld) {
        this._IWorld = IWorld;
    }

    readonly beforeEvents: WorldBeforeEvents;
    readonly afterEvents: WorldAfterEvents;
    readonly scoreboard: Scoreboard;

    /**
     * better explosion | give player credit, better damage adjustment, and knockback adjustment and it does break blocks
     */
    public createExplosion(
        radius: number,
        damage: number,
        knockbackFactor: number = 1,
        fireDuration: number = 0,
        location: Vector3,
        damagePlayers: boolean,
        damageEntities: boolean,
        source: Player
    ) {
        for (const entity of [
            ...this._IWorld.getDimension('overworld').getEntities(),
            ...this._IWorld.getAllPlayers()
        ]) {
            if (entity === source.getIEntity()) continue; // dont damage player that caused the splash damage
            if (!damagePlayers && entity instanceof Player) continue;
            if (!damageEntities && entity instanceof Entity) continue;

            const deltaX = entity.location.x - location.x;
            const deltaY = entity.location.y - location.y;
            const deltaZ = entity.location.z - location.z;

            const distanceSquared = deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ;
            const distance = Math.sqrt(distanceSquared);

            if (distance <= radius) {
                if (knockbackFactor) {
                    const horizontalFactor = Math.min(1.0, distance / radius);
                    const verticalFactor = 1.0 - horizontalFactor; // modify better for later

                    const directionX = deltaX / distance;
                    const directionZ = deltaZ / distance;
                    const horizontalStrength = knockbackFactor * horizontalFactor;
                    const verticalStrength = knockbackFactor * verticalFactor;

                    // Apply knockback using applyKnockback
                    try {
                        entity.applyKnockback(directionX, directionZ, horizontalStrength, verticalStrength);
                    } catch {} // some entities dont support knockback
                }

                if (fireDuration) entity.setOnFire(fireDuration);

                const damageAmount = Math.round(Math.max(0, damage - distance));
                if (source !== undefined)
                    entity.runCommand(`damage @s ${damageAmount} entity_explosion entity "${source.getNameTag()}"`);
                if (source === undefined) entity.runCommand(`damage @s ${damageAmount} entity_explosion`);
            }
        }
    }

    //copy all methods and properties from IWorld
    public get IWorld(): IWorld {
        return this._IWorld;
    }

    public broadcastClientMessage(id: string, value: string): void {
        this._IWorld.broadcastClientMessage(id, value);
    }

    public getAbsoluteTime(): number {
        return this._IWorld.getAbsoluteTime();
    }

    public getAllPlayers(): Player[] {
        return this._IWorld.getAllPlayers().map(player => new Player(player));
    }

    public getDay(): number {
        return this._IWorld.getDay();
    }

    public getDefaultSpawnLocation(): Vector3 {
        return this._IWorld.getDefaultSpawnLocation();
    }

    public getDimension(dimensionId: string): Dimension {
        return this._IWorld.getDimension(dimensionId);
    }

    public getDynamicProperty(identifier: string): boolean | number | string | undefined {
        return this._IWorld.getDynamicProperty(identifier);
    }

    public getEntity(id: string): Entity | undefined {
        return this._IWorld.getEntity(id);
    }

    public getPlayers(options?: EntityQueryOptions): Player[] {
        return this._IWorld.getPlayers(options).map(player => new Player(player));
    }

    public getTimeOfDay(): number {
        return this._IWorld.getTimeOfDay();
    }

    public playMusic(trackID: string, musicOptions?: MusicOptions): void {
        this._IWorld.playMusic(trackID, musicOptions);
    }

    public playSound(soundID: string, location: Vector3, soundOptions?: WorldSoundOptions): void {
        this._IWorld.playSound(soundID, location, soundOptions);
    }

    public queueMusic(trackID: string, musicOptions?: MusicOptions): void {
        this._IWorld.queueMusic(trackID, musicOptions);
    }

    public removeDynamicProperty(identifier: string): boolean {
        return this._IWorld.removeDynamicProperty(identifier);
    }

    public sendMessage(message: (RawMessage | string)[] | RawMessage | string): void {
        this._IWorld.sendMessage(message);
    }

    public setAbsoluteTime(absoluteTime: number): void {
        this._IWorld.setAbsoluteTime(absoluteTime);
    }

    public setDefaultSpawnLocation(spawnLocation: Vector3): void {
        this._IWorld.setDefaultSpawnLocation(spawnLocation);
    }

    public setDynamicProperty(identifier: string, value: boolean | number | string): void {
        this._IWorld.setDynamicProperty(identifier, value);
    }

    public setTimeOfDay(timeOfDay: number | TimeOfDay): void {
        this._IWorld.setTimeOfDay(timeOfDay);
    }

    public stopMusic(): void {
        this._IWorld.stopMusic();
    }
}
