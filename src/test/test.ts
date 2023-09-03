import {
    ItemStack,
    ItemUseBeforeEvent,
    ItemUseOnBeforeEvent,
    WorldBeforeEvents,
    Player as IPlayer,
    Entity as IEntity,
    PistonActivateBeforeEvent,
    ChatSendBeforeEvent,
    DefinitionModifier,
    DataDrivenEntityTriggerBeforeEvent,
    ExplosionBeforeEvent,
    ItemDefinitionTriggeredBeforeEvent,
    Vector3,
    ChatSendAfterEvent,
    WorldAfterEvents
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
    public chatSend = new EventSubscription<MinecraftChatSendBeforeEvent>();
    public dataDrivenEntityTriggerEvent = new EventSubscription<MinecraftDataDrivenEntityTriggerEvent>();
    public explosion = new EventSubscription<MinecraftExplosionBeforeEvent>();
    public itemDefinition = new EventSubscription<MinecraftItemDefinitionEvent>();
    public pistonActivate = new EventSubscription<MinecraftPistonActivateEvent>();

    // ... Add other custom events here

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

        originalEvents.chatSend.subscribe(originalEvent => {
            const customEvent = new MinecraftChatSendBeforeEvent(originalEvent);
            this.chatSend.emit(customEvent);
        });

        originalEvents.dataDrivenEntityTriggerEvent.subscribe(originalEvent => {
            const customEvent = new MinecraftDataDrivenEntityTriggerEvent(originalEvent);
            this.dataDrivenEntityTriggerEvent.emit(customEvent);
        });

        originalEvents.explosion.subscribe(originalEvent => {
            const customEvent = new MinecraftExplosionBeforeEvent(originalEvent);
            this.explosion.emit(customEvent);
        });

        originalEvents.itemDefinitionEvent.subscribe(originalEvent => {
            const customEvent = new MinecraftItemDefinitionEvent(originalEvent);
            this.itemDefinition.emit(customEvent);
        });

        originalEvents.pistonActivate.subscribe(originalEvent => {
            const customEvent = new MinecraftPistonActivateEvent(originalEvent);
            this.pistonActivate.emit(customEvent);
        });

        // ... Add other custom events here
    }
}

export class MinecraftAfterEvents {
    public itemUse = new EventSubscription<MinecraftItemUseEvent>();
    public itemUseOn = new EventSubscription<MinecraftItemUseOnEvent>();
    public chatSend = new EventSubscription<MinecraftChatSendAfterEvent>();
    public dataDrivenEntityTriggerEvent = new EventSubscription<MinecraftDataDrivenEntityTriggerEvent>();
    public explosion = new EventSubscription<MinecraftExplosionBeforeEvent>();
    public itemDefinition = new EventSubscription<MinecraftItemDefinitionEvent>();
    public pistonActivate = new EventSubscription<MinecraftPistonActivateEvent>();

    constructor(originalEvents: WorldAfterEvents) {
        // Subscribe to the original Minecraft events and link them to your custom events

        originalEvents.chatSend.subscribe(originalEvent => {
            const customEvent = new MinecraftChatSendAfterEvent(originalEvent);
            this.chatSend.emit(customEvent);
        });

        // ... Add other custom events here
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

export class MinecraftPistonActivateEvent {
    private originalEvent: PistonActivateBeforeEvent;

    constructor(originalEvent: PistonActivateBeforeEvent) {
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

export class MinecraftItemDefinitionEvent {
    private originalEvent: ItemDefinitionTriggeredBeforeEvent;

    constructor(originalEvent: ItemDefinitionTriggeredBeforeEvent) {
        this.originalEvent = originalEvent;
    }

    set cancel(bool: boolean) {
        this.originalEvent.cancel = bool;
    }
}

export class MinecraftExplosionBeforeEvent {
    private originalEvent: ExplosionBeforeEvent;

    constructor(originalEvent: ExplosionBeforeEvent) {
        this.originalEvent = originalEvent;
    }

    set cancel(bool: boolean) {
        this.originalEvent.cancel = bool;
    }

    setImpactedBlocks(blocks: Vector3[]): void {
        this.originalEvent.setImpactedBlocks(blocks);
    }
}

export class MinecraftDataDrivenEntityTriggerEvent {
    private originalEvent: DataDrivenEntityTriggerBeforeEvent;

    constructor(originalEvent: DataDrivenEntityTriggerBeforeEvent) {
        this.originalEvent = originalEvent;
    }

    set cancel(bool: boolean) {
        this.originalEvent.cancel = bool;
    }

    get entity(): Entity {
        return new Entity(this.originalEvent.entity);
    }

    get id(): string {
        return this.originalEvent.id;
    }

    getModifiers(): DefinitionModifier[] {
        return this.originalEvent.getModifiers();
    }

    setModifiers(modifiers: DefinitionModifier[]): void {
        this.originalEvent.setModifiers(modifiers);
    }
}

export class MinecraftChatSendAfterEvent {
    protected originalEvent: ChatSendAfterEvent;

    constructor(originalEvent: ChatSendAfterEvent) {
        this.originalEvent = originalEvent;
    }

    get message(): string {
        return this.originalEvent.message;
    }

    set message(newMessage: string) {
        this.originalEvent.message = newMessage;
    }

    get sender(): Player {
        return new Player(this.originalEvent.sender);
    }

    get sendToTargets(): boolean {
        return this.originalEvent.sendToTargets;
    }

    getTargets(): Player[] {
        return this.originalEvent.getTargets().map(player => new Player(player));
    }

    afterEvent(): void {
        console.warn("This is a test, event successfully fired!");
    }
}

export class MinecraftChatSendBeforeEvent extends MinecraftChatSendAfterEvent {
    protected originalEvent: ChatSendBeforeEvent;

    constructor(originalEvent: ChatSendBeforeEvent) {
        super(originalEvent);
        this.originalEvent = originalEvent;
    }

    set cancel(bool: boolean) {
        this.originalEvent.cancel = bool;
    }

    test(): void {
        this.sender.sendMessage('it works lmfao');
    }
}