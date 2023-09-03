import {
    ItemStack,
    ItemUseBeforeEvent,
    ItemUseOnBeforeEvent,
    WorldBeforeEvents,
    Player as IPlayer,
    Entity as IEntity
} from '@minecraft/server';
import { Player } from '../player/index';
import { Entity } from '../entity/index';

type EventCallback<T> = (arg: T) => void;

export class EventSubscription<T> {
    private subscribers: ((event: T) => void)[] = [];

    subscribe(callback: (event: T) => void): void {
        this.subscribers.push(callback);
    }

    unsubscribe(callback: (event: T) => void): void {
        const index = this.subscribers.indexOf(callback);
        if (index > -1) {
            this.subscribers.splice(index, 1);
        }
    }

    emit(event: T): void {
        this.subscribers.forEach(callback => callback(event));
    }
}

export class MinecraftBeforeEvents {
    public itemUse = new EventSubscription<MinecraftItemUseEvent>();
    public itemUseOn = new EventSubscription<MinecraftItemUseOnEvent>();
    // ... define other event types here

    constructor(originalEvents: WorldBeforeEvents) {
        // Subscribe to the original Minecraft events and link them to your custom events

        originalEvents.itemUse.subscribe(originalEvent => {
            const customEvent = new MinecraftItemUseEvent(originalEvent);
            this.itemUse.emit(customEvent);
        });

        originalEvents.itemUseOn.subscribe(originalEvent => {
            const customEvent = new MinecraftItemUseOnEvent(originalEvent);
            this.itemUseOn.emit(customEvent);
        });

        // ... Initialize other original Minecraft events here
    }
}

export class MinecraftItemUseOnEvent {
    private originalEvent: ItemUseOnBeforeEvent;

    constructor(originalEvent: ItemUseOnBeforeEvent) {
        this.originalEvent = originalEvent;
    }

    set cancel(bool: boolean) {
        this.originalEvent.cancel = bool;
    }
}

export class MinecraftItemUseEvent {
    private originalEvent: ItemUseBeforeEvent;

    constructor(originalEvent: ItemUseBeforeEvent) {
        this.originalEvent = originalEvent;
    }

    set cancel(bool: boolean) {
        this.originalEvent.cancel = bool;
    }

    get itemStack(): ItemStack {
        return this.originalEvent.itemStack;
    }

    get source(): Player | Entity {
        if (!(this.originalEvent.source instanceof IPlayer)) {
            return new Entity(this.originalEvent.source);
        }

        return new Player(this.originalEvent.source);
    }

    public log(): void {
        console.warn("This is a test, event successfully fired!");
    }
}
