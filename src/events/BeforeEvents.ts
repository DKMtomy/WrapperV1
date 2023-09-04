import {
    Player as IPlayer,
    Entity as IEntity,
    Block,
    ChatSendBeforeEvent,
    DataDrivenEntityTriggerBeforeEvent,
    DefinitionModifier,
    Direction,
    ExplosionBeforeEvent,
    ItemDefinitionTriggeredBeforeEvent,
    ItemStack,
    ItemUseBeforeEvent,
    ItemUseOnBeforeEvent,
    PistonActivateBeforeEvent,
    Vector3
} from '@minecraft/server';
import { MinecraftChatSendAfterEvent, MinecraftDataDrivenEntityTriggerEventAfter } from './AfterEvents';
import { Entity } from '../entity/index';
import { Player } from '../player/index';

export interface IOriginalBeforeEvent {
    cancel: boolean;
}

export abstract class MinecraftBeforeEvent<T extends IOriginalBeforeEvent> {
    protected originalEvent: T;

    constructor(originalEvent: T) {
        this.originalEvent = originalEvent;
    }

    set cancel(bool: boolean) {
        this.originalEvent.cancel = bool;
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

export class MinecraftDataDrivenEntityTriggerEventBefore extends MinecraftDataDrivenEntityTriggerEventAfter {
    protected originalEvent: DataDrivenEntityTriggerBeforeEvent;

    constructor(originalEvent: DataDrivenEntityTriggerBeforeEvent) {
        super(originalEvent);
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

export class MinecraftExplosionBeforeEvent {
    protected originalEvent: ExplosionBeforeEvent;

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

export class MinecraftItemDefinitionEvent {
    protected originalEvent: ItemDefinitionTriggeredBeforeEvent;

    constructor(originalEvent: ItemDefinitionTriggeredBeforeEvent) {
        this.originalEvent = originalEvent;
    }

    set cancel(bool: boolean) {
        this.originalEvent.cancel = bool;
    }
}

export class MinecraftItemUseEvent {
    protected originalEvent: ItemUseBeforeEvent;

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
        console.warn('This is a test, event successfully fired!');
    }
}

export class MinecraftItemUseOnEvent {
    protected originalEvent: ItemUseOnBeforeEvent;

    constructor(originalEvent: ItemUseOnBeforeEvent) {
        this.originalEvent = originalEvent;
    }

    set cancel(bool: boolean) {
        this.originalEvent.cancel = bool;
    }

    get block(): Block {
        return this.block;
    }

    get blockFace(): Direction {
        return this.originalEvent.blockFace;
    }

    get faceLocation(): Vector3 {
        return this.originalEvent.faceLocation;
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
}

export class MinecraftPistonActivateEvent {
    protected originalEvent: PistonActivateBeforeEvent;

    constructor(originalEvent: PistonActivateBeforeEvent) {
        this.originalEvent = originalEvent;
    }

    set cancel(bool: boolean) {
        this.originalEvent.cancel = bool;
    }
}
