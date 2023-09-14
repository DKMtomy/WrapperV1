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

import { CommandManager } from '../commands/CommandManager';
import { ClientEvents, Awaitable, DimensionNamespace, ServerCommandResponse } from '../types/index';
import { EventEmitter } from '../polyfill/EventEmitter';
import AbstractEvent from '../testEvents/AbstractEvent';
import { OnChat } from '../testEvents/OnChat';
import { events } from '../testEvents/index';
import { PlayerManager } from '../player/PlayerManager';
import { WorldManager } from '../world/WorldManager';

type PropertyValue = boolean | number | string | undefined;

export interface Client {
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

export class Client extends EventEmitter {
    protected readonly _events = new Map<string, AbstractEvent>();

    /**
     * Protected IWorld object being wrapped.
     */
    protected readonly _IWorld: IWorld;

    public version: string;

    public readonly commands = new CommandManager(this);

    public readonly players = new PlayerManager(this);

    public readonly world = new WorldManager(this);

    // public beforeEvents: WorldBeforeEvents

    constructor() {
        super();
        this.initializeEvents();
        this._IWorld = MinecraftWorld;
        this.version = '1.0.0';
    }

    private initializeEvents() {
        for (const event of events) {
            const eventName = event.prototype.name;
            if (!this._events.has(eventName)) {
                this.loadEvent(event);
            }
        }
    }

    /**
     * Loads a new event on the client. Events loaded MUST extend `AbstractClass`.
     * See [events folder](https://github.com/MCBE-Utilities/CraftedAPI/tree/beta/packages/CraftedAPI/src/events) for formatting.
     * @param event Non contructed event to load.
     * @returns
     */
    public loadEvent(event: new (client: Client) => AbstractEvent): void {
        const builtEvent = new event(this);

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
            `[CraftedAPI]: Event "${name}" appears be deprecated, skipping registration. Please report this issue here: https://github.com/MCBE-Utilities/CraftedAPI/issues`
        );
    }

    /**
     * Verifies an event is a valid Minecraft IEvent.
     * The name `custom` returns `true` because CraftedAPI registers
     * a handful of custom events not made by Minecraft.
     * @param name Name of IEvent.
     * @returns `true` means exists.
     */
    public verifyIEvent(name: string): boolean {
        if (name === 'custom') return true;
        return (
            Object.keys(WorldBeforeEvents.prototype).includes(name) ||
            Object.keys(WorldAfterEvents.prototype).includes(name) ||
            false
        );
    }

    /**
     * Executes a world level command.
     * @param cmd Command string.
     * @param dimension Optional dimensino to execute in.
     * @param debug Send errors to content log?
     * @returns
     */
    public executeCommand<T>(
        cmd: string,
        dimension: DimensionNamespace | string = 'minecraft:overworld',
        debug = false
    ): ServerCommandResponse<T> {
        try {
            const command = this.world.getDimension(dimension).executeCommand(cmd);

            return {
                successCount: command.successCount,
                data: command as T,
                err: false
            };
        } catch (error) {
            if (debug) console.info(error);

            return {
                successCount: 0,
                data: null,
                err: true
            };
        }
    }
}
