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
    world as MinecraftWorld,
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
    TimeOfDay,
    system
} from '@minecraft/server';

import { Vec3 } from '../vector/index';
import { Player } from '../player/index';
import { MinecraftAfterEvents, MinecraftBeforeEvents } from '../events/Events';
import { CommandManager } from '../commands/CommandManager';
import { ClientEvents, Awaitable } from '../types/index';
import { EventEmitter } from '../polyfill/EventEmitter';
import AbstractEvent from '../testEvents/AbstractEvent';
import { OnChat } from '../testEvents/OnChat';
import { events } from '../testEvents/index';

type PropertyValue = boolean | number | string | undefined;

export interface Client2 {
    on: (<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => Awaitable<void>) => void) &
        (<S extends string | symbol>(
            event: Exclude<S, keyof ClientEvents>,
            listener: (...args: any[]) => Awaitable<void>
        ) => void);

    addListener: (<K extends keyof ClientEvents>(
        event: K,
        listener: (...args: ClientEvents[K]) => Awaitable<void>
    ) => void) &
        (<S extends string | symbol>(
            event: Exclude<S, keyof ClientEvents>,
            listener: (...args: any[]) => Awaitable<void>
        ) => void);

    once: (<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => Awaitable<void>) => this) &
        (<S extends string | symbol>(
            event: Exclude<S, keyof ClientEvents>,
            listener: (...args: any[]) => Awaitable<void>
        ) => void);

    emit: (<K extends keyof ClientEvents>(event: K, ...args: ClientEvents[K]) => void) &
        (<S extends string | symbol>(event: Exclude<S, keyof ClientEvents>, ...args: unknown[]) => void);

    envokeEvent: (<K extends keyof ClientEvents>(event: K, ...args: ClientEvents[K]) => void) &
        (<S extends string | symbol>(event: Exclude<S, keyof ClientEvents>, ...args: unknown[]) => void);

    off: (<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => Awaitable<void>) => void) &
        (<S extends string | symbol>(
            event: Exclude<S, keyof ClientEvents>,
            listener: (...args: any[]) => Awaitable<void>
        ) => void);

    removeListener: (<K extends keyof ClientEvents>(
        event: K,
        listener: (...args: ClientEvents[K]) => Awaitable<void>
    ) => void) &
        (<S extends string | symbol>(
            event: Exclude<S, keyof ClientEvents>,
            listener: (...args: any[]) => Awaitable<void>
        ) => void);

    removeListeners: (<K extends keyof ClientEvents>(event?: K) => void) &
        (<S extends string | symbol>(event?: Exclude<S, keyof ClientEvents>) => void);
}

export class Client2 extends EventEmitter {
    protected readonly _events = new Map<string, AbstractEvent>();

    public constructor() {
        super();
        console.log('Client2 constructor');
        for (const event of events) {
            // If events does not already contain
            if (!this._events.has(event.prototype.name)) {
                // Load the unregistered event.
                this.loadEvent(event);
            }
        }
    }

    /**
     * Loads a new event on the client. Events loaded MUST extend `AbstractClass`.
     * See [events folder](https://github.com/MCBE-Utilities/BeAPI/tree/beta/packages/beapi/src/events) for formatting.
     * @param event Non contructed event to load.
     * @returns
     */
    public loadEvent(event: new (client: Client2) => AbstractEvent): void {
        const builtEvent = new event(this);

        console.log(this.verifyIEvent(builtEvent.iName));

        if (!this.verifyIEvent(builtEvent.iName)) return this.deprecated(builtEvent.iName);

        this._events.set(builtEvent.name, builtEvent);
        builtEvent.on();
    }

    /**
     * Sends deprecated event message in content log.
     * @param name Name of event
     * @returns
     */
    protected deprecated(name: string): void {
        return console.warn(
            `[BeAPI]: Event "${name}" appears be deprecated, skipping registration. Please report this issue here: https://github.com/MCBE-Utilities/BeAPI/issues`
        );
    }

    /**
     * Verifies an event is a valid Minecraft IEvent.
     * The name `custom` returns `true` because BeAPI registers
     * a handful of custom events not made by Minecraft.
     * @param name Name of IEvent.
     * @returns `true` means exists.
     */
    public verifyIEvent(name: string): boolean {
        if (name === 'custom') return true;
        return (
            Object.keys(WorldBeforeEvents.prototype).includes(name) ??
            Object.keys(WorldAfterEvents.prototype).includes(name)
        );
    }
}

export class Client {
    [key: string]: any;

    /**
     * Protected IWorld object being wrapped.
     */
    protected readonly _IWorld: IWorld;

    public version: string;

    public beforeEvents: MinecraftBeforeEvents;

    public afterEvents: MinecraftAfterEvents;

    public readonly commands: CommandManager;

    // public beforeEvents: WorldBeforeEvents

    constructor() {
        this._IWorld = MinecraftWorld;

        this.beforeEvents = new MinecraftBeforeEvents(this._IWorld.beforeEvents);

        this.afterEvents = new MinecraftAfterEvents(this._IWorld.afterEvents);

        this.commands = new CommandManager(this);

        this.version = '1.0.0';
    }

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
                system.run(() => {
                    if (source !== undefined)
                        entity.runCommand(`damage @s ${damageAmount} entity_explosion entity "${source.getNameTag()}"`);
                    if (source === undefined) entity.runCommand(`damage @s ${damageAmount} entity_explosion`);
                });
            }
        }
    }

    // Expose 'scoreboard' as a property on WorldWrapper
    get scoreboard(): Scoreboard {
        return this._IWorld.scoreboard;
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
