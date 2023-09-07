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
    WorldAfterEvents,
    BlockPermutation,
    BlockBreakAfterEvent,
    BlockExplodeAfterEvent,
    BlockPlaceAfterEvent,
    ButtonPushAfterEvent,
    Block,
    Dimension,
    Direction,
    DataDrivenEntityTriggerAfterEvent,
    EffectAddAfterEvent,
    Effect,
    EntityDamageSource,
    EntityDieAfterEvent,
    EntityHealthChangedAfterEvent
} from '@minecraft/server';
import { Player } from '../player/index';
import { Entity } from '../entity/index';
import {
    MinecraftBlockBreakAfter,
    MinecraftBlockExplodeAfter,
    MinecraftBlockPlaceAfter,
    MinecraftButtonPushAfter,
    MinecraftChatSendAfterEvent,
    MinecraftDataDrivenEntityTriggerEventAfter,
    MinecraftEffectAddAfter,
    MinecraftEntityDieAfter,
    MinecraftEntityHealthChangedAfter,
    MinecraftEntityHitBlockAfter,
    MinecraftEntityHitEntityAfter,
    MinecraftEntityHurtAfter,
    MinecraftEntityRemovedAfter,
    MinecraftEntitySpawnAfter,
    MinecraftItemCompleteUseAfter,
    MinecraftItemReleaseUseAfter,
    MinecraftItemStartUseAfter,
    MinecraftItemStopUseAfter,
    MinecraftItemStopUseOnAfter,
    MinecraftLeverActionAfter,
    MinecraftMessageReceiveAfter,
    MinecraftPlayerJoinAfter,
    MinecraftPlayerLeaveAfter,
    MinecraftPlayerSpawnAfter,
    MinecraftPressurePlatePopAfter,
    MinecraftPressurePlatePushAfter,
    MinecraftProjectileHitAfter,
    MinecraftTargetBlockHitAfter,
    MinecraftTripWireAfter,
    MinecraftWheaterChangeAfter,
    MinecraftWorldInitializeAfter
} from './AfterEvents';
import {
    MinecraftChatSendBeforeEvent,
    MinecraftDataDrivenEntityTriggerEventBefore,
    MinecraftExplosionBeforeEvent,
    MinecraftItemDefinitionEvent,
    MinecraftItemUseEvent,
    MinecraftItemUseOnEvent,
    MinecraftPistonActivateEvent
} from './BeforeEvents';

type EventCallback<T> = (arg: T) => void;

export class EventSubscription<T> {
    private subscribers: EventCallback<T>[] = [];
    private onceSubscribers: EventCallback<T>[] = [];

    on(callback: EventCallback<T>): void {
        this.subscribers.push(callback);
    }

    once(callback: EventCallback<T>): void {
        this.onceSubscribers.push(callback);
    }

    off(callback: EventCallback<T>): void {
        const filterSubscribers = (sub: EventCallback<T>) => sub !== callback;
        this.subscribers = this.subscribers.filter(filterSubscribers);
        this.onceSubscribers = this.onceSubscribers.filter(filterSubscribers);
    }

    emit(event: T): void {
        this.subscribers.forEach(callback => callback(event));
        this.onceSubscribers.forEach(callback => callback(event));
        this.onceSubscribers = [];
    }
}

export class MinecraftBeforeEvents {
    public itemUse = new EventSubscription<MinecraftItemUseEvent>();
    public itemUseOn = new EventSubscription<MinecraftItemUseOnEvent>();
    public chatSend = new EventSubscription<MinecraftChatSendBeforeEvent>();
    public dataDrivenEntityTriggerEvent = new EventSubscription<MinecraftDataDrivenEntityTriggerEventBefore>();
    public explosion = new EventSubscription<MinecraftExplosionBeforeEvent>();
    public itemDefinition = new EventSubscription<MinecraftItemDefinitionEvent>();
    public pistonActivate = new EventSubscription<MinecraftPistonActivateEvent>();


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
            const customEvent = new MinecraftDataDrivenEntityTriggerEventBefore(originalEvent);
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
    public blockBreak = new EventSubscription<MinecraftBlockBreakAfter>();
    public blockExplode = new EventSubscription<MinecraftBlockExplodeAfter>();
    public blockPlace = new EventSubscription<MinecraftBlockPlaceAfter>();
    public buttonPush = new EventSubscription<MinecraftButtonPushAfter>();
    public effectAdd = new EventSubscription<MinecraftEffectAddAfter>();
    public entityDie = new EventSubscription<MinecraftEntityDieAfter>();
    public entityHealthChanged = new EventSubscription<MinecraftEntityHealthChangedAfter>();
    public entityHitBlock = new EventSubscription<MinecraftEntityHitBlockAfter>();
    public entityHitEntity = new EventSubscription<MinecraftEntityHitEntityAfter>();
    public entityHurt = new EventSubscription<MinecraftEntityHurtAfter>();
    public entityRemoved = new EventSubscription<MinecraftEntityRemovedAfter>();
    public entitySpawn = new EventSubscription<MinecraftEntitySpawnAfter>();
    public itemCompleteUse = new EventSubscription<MinecraftItemCompleteUseAfter>();
    public itemReleaseUse = new EventSubscription<MinecraftItemReleaseUseAfter>();
    public itemStartUse = new EventSubscription<MinecraftItemStartUseAfter>();
    public itemStopUse = new EventSubscription<MinecraftItemStopUseAfter>();
    public itemStopUseOn = new EventSubscription<MinecraftItemStopUseOnAfter>();
    public leverAction = new EventSubscription<MinecraftLeverActionAfter>();
    public messageReceive = new EventSubscription<MinecraftMessageReceiveAfter>();
    public playerJoin = new EventSubscription<MinecraftPlayerJoinAfter>();
    public playerLeave = new EventSubscription<MinecraftPlayerLeaveAfter>();
    public playerSpawn = new EventSubscription<MinecraftPlayerSpawnAfter>();
    public pressurePlatePop = new EventSubscription<MinecraftPressurePlatePopAfter>();
    public pressurePlatePush = new EventSubscription<MinecraftPressurePlatePushAfter>();
    public projectileHit = new EventSubscription<MinecraftProjectileHitAfter>();
    public targetBlockHit = new EventSubscription<MinecraftTargetBlockHitAfter>();
    public tripWireTrip = new EventSubscription<MinecraftTripWireAfter>();
    public weatherChange = new EventSubscription<MinecraftWheaterChangeAfter>();
    public worldInitialize = new EventSubscription<MinecraftWorldInitializeAfter>();
    public itemUse = new EventSubscription<MinecraftItemUseEvent>();
    public itemUseOn = new EventSubscription<MinecraftItemUseOnEvent>();
    public chatSend = new EventSubscription<MinecraftChatSendAfterEvent>();
    public dataDrivenEntityTriggerEvent = new EventSubscription<MinecraftDataDrivenEntityTriggerEventAfter>();
    public explosion = new EventSubscription<MinecraftExplosionBeforeEvent>();
    public itemDefinition = new EventSubscription<MinecraftItemDefinitionEvent>();
    public pistonActivate = new EventSubscription<MinecraftPistonActivateEvent>();

    constructor(originalEvents: WorldAfterEvents) {
        // Subscribe to the original Minecraft events and link them to your custom events

        originalEvents.chatSend.subscribe(originalEvent => {
            const customEvent = new MinecraftChatSendAfterEvent(originalEvent);
            this.chatSend.emit(customEvent);
        });

        //do this dynamically
        originalEvents.blockBreak.subscribe(originalEvent => {
            const customEvent = new MinecraftBlockBreakAfter(originalEvent);
            this.blockBreak.emit(customEvent);
        });

        originalEvents.blockExplode.subscribe(originalEvent => {
            const customEvent = new MinecraftBlockExplodeAfter(originalEvent);
            this.blockExplode.emit(customEvent);
        });

        originalEvents.blockPlace.subscribe(originalEvent => {
            const customEvent = new MinecraftBlockPlaceAfter(originalEvent);
            this.blockPlace.emit(customEvent);
        });

        originalEvents.buttonPush.subscribe(originalEvent => {
            const customEvent = new MinecraftButtonPushAfter(originalEvent);
            this.buttonPush.emit(customEvent);
        });

        originalEvents.effectAdd.subscribe(originalEvent => {
            const customEvent = new MinecraftEffectAddAfter(originalEvent);
            this.effectAdd.emit(customEvent);
        });

        originalEvents.entityDie.subscribe(originalEvent => {
            const customEvent = new MinecraftEntityDieAfter(originalEvent);
            this.entityDie.emit(customEvent);
        });

        originalEvents.entityHealthChanged.subscribe(originalEvent => {
            const customEvent = new MinecraftEntityHealthChangedAfter(originalEvent);
            this.entityHealthChanged.emit(customEvent);
        });

        originalEvents.entityHitBlock.subscribe(originalEvent => {
            const customEvent = new MinecraftEntityHitBlockAfter(originalEvent);
            this.entityHitBlock.emit(customEvent);
        });

        originalEvents.entityHitEntity.subscribe(originalEvent => {
            const customEvent = new MinecraftEntityHitEntityAfter(originalEvent);
            this.entityHitEntity.emit(customEvent);
        });

        originalEvents.entityHurt.subscribe(originalEvent => {
            const customEvent = new MinecraftEntityHurtAfter(originalEvent);
            this.entityHurt.emit(customEvent);
        });

        originalEvents.entityRemoved.subscribe(originalEvent => {
            const customEvent = new MinecraftEntityRemovedAfter(originalEvent);
            this.entityRemoved.emit(customEvent);
        });

        originalEvents.entitySpawn.subscribe(originalEvent => {
            const customEvent = new MinecraftEntitySpawnAfter(originalEvent);
            this.entitySpawn.emit(customEvent);
        });

        originalEvents.itemCompleteUse.subscribe(originalEvent => {
            const customEvent = new MinecraftItemCompleteUseAfter(originalEvent);
            this.itemCompleteUse.emit(customEvent);
        });

        originalEvents.itemReleaseUse.subscribe(originalEvent => {
            const customEvent = new MinecraftItemReleaseUseAfter(originalEvent);
            this.itemReleaseUse.emit(customEvent);
        });

        originalEvents.itemStartUse.subscribe(originalEvent => {
            const customEvent = new MinecraftItemStartUseAfter(originalEvent);
            this.itemStartUse.emit(customEvent);
        });

        originalEvents.itemStopUse.subscribe(originalEvent => {
            const customEvent = new MinecraftItemStopUseAfter(originalEvent);
            this.itemStopUse.emit(customEvent);
        });

        originalEvents.itemStopUseOn.subscribe(originalEvent => {
            const customEvent = new MinecraftItemStopUseOnAfter(originalEvent);
            this.itemStopUseOn.emit(customEvent);
        });

        originalEvents.leverAction.subscribe(originalEvent => {
            const customEvent = new MinecraftLeverActionAfter(originalEvent);
            this.leverAction.emit(customEvent);
        });

        originalEvents.messageReceive.subscribe(originalEvent => {
            const customEvent = new MinecraftMessageReceiveAfter(originalEvent);
            this.messageReceive.emit(customEvent);
        });

        originalEvents.playerJoin.subscribe(originalEvent => {
            const customEvent = new MinecraftPlayerJoinAfter(originalEvent);
            this.playerJoin.emit(customEvent);
        });

        originalEvents.playerLeave.subscribe(originalEvent => {
            const customEvent = new MinecraftPlayerLeaveAfter(originalEvent);
            this.playerLeave.emit(customEvent);
        });

        originalEvents.playerSpawn.subscribe(originalEvent => {
            const customEvent = new MinecraftPlayerSpawnAfter(originalEvent);
            this.playerSpawn.emit(customEvent);
        });

        originalEvents.pressurePlatePop.subscribe(originalEvent => {
            const customEvent = new MinecraftPressurePlatePopAfter(originalEvent);
            this.pressurePlatePop.emit(customEvent);
        });

        originalEvents.pressurePlatePush.subscribe(originalEvent => {
            const customEvent = new MinecraftPressurePlatePushAfter(originalEvent);
            this.pressurePlatePush.emit(customEvent);
        });

        originalEvents.projectileHit.subscribe(originalEvent => {
            const customEvent = new MinecraftProjectileHitAfter(originalEvent);
            this.projectileHit.emit(customEvent);
        });

        originalEvents.targetBlockHit.subscribe(originalEvent => {
            const customEvent = new MinecraftTargetBlockHitAfter(originalEvent);
            this.targetBlockHit.emit(customEvent);
        });

        originalEvents.tripWireTrip.subscribe(originalEvent => {
            const customEvent = new MinecraftTripWireAfter(originalEvent);
            this.tripWireTrip.emit(customEvent);
        });

        originalEvents.weatherChange.subscribe(originalEvent => {
            const customEvent = new MinecraftWheaterChangeAfter(originalEvent);
            this.weatherChange.emit(customEvent);
        });

        originalEvents.worldInitialize.subscribe(originalEvent => {
            const customEvent = new MinecraftWorldInitializeAfter(originalEvent);
            this.worldInitialize.emit(customEvent);
        });
    }
}