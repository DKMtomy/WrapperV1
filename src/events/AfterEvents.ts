import {
    Block,
    BlockBreakAfterEvent,
    BlockExplodeAfterEvent,
    BlockHitInformation,
    BlockPermutation,
    BlockPistonComponent,
    BlockPlaceAfterEvent,
    ButtonPushAfterEvent,
    ChatSendAfterEvent,
    DataDrivenEntityTriggerAfterEvent,
    DefinitionModifier,
    Dimension,
    Direction,
    Effect,
    EffectAddAfterEvent,
    EntityDamageSource,
    EntityDieAfterEvent,
    EntityHealthChangedAfterEvent,
    EntityHitBlockAfterEvent,
    EntityHitEntityAfterEvent,
    EntityHitInformation,
    EntityHurtAfterEvent,
    EntityRemovedAfterEvent,
    EntitySpawnAfterEvent,
    ExplosionAfterEvent,
    ItemCompleteUseAfterEvent,
    ItemDefinitionTriggeredAfterEvent,
    ItemReleaseUseAfterEvent,
    ItemStack,
    ItemStartUseAfterEvent,
    ItemStartUseOnAfterEvent,
    ItemStopUseAfterEvent,
    ItemStopUseOnAfterEvent,
    ItemUseAfterEvent,
    ItemUseOnAfterEvent,
    LeverActionAfterEvent,
    MessageReceiveAfterEvent,
    PistonActivateAfterEvent,
    PlayerJoinAfterEvent,
    PlayerLeaveAfterEvent,
    PlayerSpawnAfterEvent,
    PressurePlatePopAfterEvent,
    PressurePlatePushAfterEvent,
    ProjectileHitAfterEvent,
    PropertyRegistry,
    TargetBlockHitAfterEvent,
    TripWireTripAfterEvent,
    Vector3,
    WeatherChangeAfterEvent,
    WorldInitializeAfterEvent,
    world
} from '@minecraft/server';
import { Entity } from '../entity/index';
import { Player } from '../player/index';

export abstract class MinecraftAfterEvent<T> {
    protected originalEvent: T;

    constructor(originalEvent: T) {
        this.originalEvent = originalEvent;
    }
}

export class MinecraftWorldInitializeAfter extends MinecraftAfterEvent<WorldInitializeAfterEvent> {
    get propertyRegistry(): PropertyRegistry {
        return this.originalEvent.propertyRegistry;
    }
}

export class MinecraftWheaterChangeAfter extends MinecraftAfterEvent<WeatherChangeAfterEvent> {
    get dimension(): string {
        return this.originalEvent.dimension;
    }

    get raining(): boolean {
        return this.originalEvent.raining;
    }

    get lightning(): boolean {
        return this.originalEvent.lightning;
    }
}

export class MinecraftTripWireAfter extends MinecraftAfterEvent<TripWireTripAfterEvent> {
    get block(): Block {
        return this.originalEvent.block;
    }

    get dimension(): Dimension {
        return this.originalEvent.dimension;
    }

    get isPowered(): boolean {
        return this.originalEvent.isPowered;
    }

    get sources(): Entity[] | Player[] {
        return this.originalEvent.sources.map(source => {
            if (source instanceof Player) {
                return new Player(source);
            }
            return new Entity(source);
        });
    }
}

export class MinecraftTargetBlockHitAfter extends MinecraftAfterEvent<TargetBlockHitAfterEvent> {
    get block(): Block {
        return this.originalEvent.block;
    }

    get dimension(): Dimension {
        return this.originalEvent.dimension;
    }

    get hitVector(): Vector3 {
        return this.originalEvent.hitVector;
    }

    get previousRedstonePower(): number {
        return this.originalEvent.previousRedstonePower;
    }

    get redstonePower(): number {
        return this.originalEvent.redstonePower;
    }

    get source(): Entity | Player {
        if (this.originalEvent.source instanceof Player) {
            return new Player(this.originalEvent.source);
        }
        return new Entity(this.originalEvent.source);
    }
}

export class MinecraftProjectileHitAfter extends MinecraftAfterEvent<ProjectileHitAfterEvent> {
    get dimension(): Dimension {
        return this.originalEvent.dimension;
    }

    get hitVector(): Vector3 {
        return this.originalEvent.hitVector;
    }

    get location(): Vector3 {
        return this.originalEvent.location;
    }

    get projectile(): Entity {
        return new Entity(this.originalEvent.projectile);
    }

    get source(): Entity | Player {
        if (this.originalEvent.source instanceof Player) {
            return new Player(this.originalEvent.source);
        }
        return new Entity(this.originalEvent.source);
    }

    getBlockHit(): BlockHitInformation | undefined {
        return this.originalEvent.getBlockHit();
    }

    getEntityHit(): EntityHitInformation | undefined {
        return this.originalEvent.getEntityHit();
    }
}

export class MinecraftPressurePlatePushAfter extends MinecraftAfterEvent<PressurePlatePushAfterEvent> {
    get block(): Block {
        return this.originalEvent.block;
    }

    get dimension(): Dimension {
        return this.originalEvent.dimension;
    }

    get previousRedstonePower(): number {
        return this.originalEvent.previousRedstonePower;
    }

    get redstonePower(): number {
        return this.originalEvent.redstonePower;
    }

    get source(): Entity | Player {
        if (this.originalEvent.source instanceof Player) {
            return new Player(this.originalEvent.source);
        }
        return new Entity(this.originalEvent.source);
    }
}

export class MinecraftPressurePlatePopAfter extends MinecraftAfterEvent<PressurePlatePopAfterEvent> {
    get block(): Block {
        return this.originalEvent.block;
    }

    get dimension(): Dimension {
        return this.originalEvent.dimension;
    }

    get previousRedstonePower(): number {
        return this.originalEvent.previousRedstonePower;
    }

    get redstonePower(): number {
        return this.originalEvent.redstonePower;
    }
}

export class MinecraftPlayerSpawnAfter extends MinecraftAfterEvent<PlayerSpawnAfterEvent> {
    get player(): Player {
        return new Player(this.originalEvent.player);
    }

    get initialSpawn(): boolean {
        return this.originalEvent.initialSpawn;
    }
}

export class MinecraftPlayerLeaveAfter extends MinecraftAfterEvent<PlayerLeaveAfterEvent> {
    get playerId(): string {
        return this.originalEvent.playerId;
    }

    get playerName(): string {
        return this.originalEvent.playerName;
    }
}

export class MinecraftPlayerJoinAfter extends MinecraftAfterEvent<PlayerJoinAfterEvent> {
    get playerId(): string {
        return this.originalEvent.playerId;
    }

    get playerName(): string {
        return this.originalEvent.playerName;
    }

    get player(): Player {
        return new Player(world.getPlayers().find(player => player.name === this.playerName));
    }
}

export class MinecraftPistonActivateAfter extends MinecraftAfterEvent<PistonActivateAfterEvent> {
    get isExpanding(): boolean {
        return this.originalEvent.isExpanding;
    }

    get piston(): BlockPistonComponent {
        return this.originalEvent.piston;
    }
}

export class MinecraftMessageReceiveAfter extends MinecraftAfterEvent<MessageReceiveAfterEvent> {
    get id(): string {
        return this.originalEvent.id;
    }

    get message(): string {
        return this.originalEvent.message;
    }

    get player(): Player {
        return new Player(this.originalEvent.player);
    }
}

export class MinecraftLeverActionAfter extends MinecraftAfterEvent<LeverActionAfterEvent> {
    get isPowered(): boolean {
        return this.originalEvent.isPowered;
    }

    get player(): Player {
        return new Player(this.originalEvent.player);
    }
}

export class MinecraftItemUseOnAfter extends MinecraftAfterEvent<ItemUseOnAfterEvent> {
    get itemStack(): ItemStack {
        return this.originalEvent.itemStack;
    }

    get player(): Player | Entity {
        if (!(this.originalEvent.source instanceof Player)) {
            return new Entity(this.originalEvent.source);
        }
        return this.originalEvent.source;
    }

    get target(): Block {
        return this.originalEvent.block;
    }

    get blockFace(): Direction {
        return this.originalEvent.blockFace;
    }

    get faceLocation(): Vector3 {
        return this.originalEvent.faceLocation;
    }
}

export class MinecraftItemUseAfter extends MinecraftAfterEvent<ItemUseAfterEvent> {
    get itemStack(): ItemStack {
        return this.originalEvent.itemStack;
    }

    get player(): Player | Entity {
        if (!(this.originalEvent.source instanceof Player)) {
            return new Entity(this.originalEvent.source);
        }
        return this.originalEvent.source;
    }
}

export class MinecraftItemStopUseOnAfter extends MinecraftAfterEvent<ItemStopUseOnAfterEvent> {
    get itemStack(): ItemStack {
        return this.originalEvent.itemStack;
    }

    get player(): Player | Entity {
        if (!(this.originalEvent.source instanceof Player)) {
            return new Entity(this.originalEvent.source);
        }
        return this.originalEvent.source;
    }

    get target(): Block {
        return this.originalEvent.block;
    }
}

export class MinecraftItemStopUseAfter extends MinecraftAfterEvent<ItemStopUseAfterEvent> {
    get itemStack(): ItemStack {
        return this.originalEvent.itemStack;
    }

    get player(): Player | Entity {
        if (!(this.originalEvent.source instanceof Player)) {
            return new Entity(this.originalEvent.source);
        }
        return this.originalEvent.source;
    }

    get useDuration(): Number {
        return this.originalEvent.useDuration;
    }
}

export class MinecraftItemStartUseOnAfter extends MinecraftAfterEvent<ItemStartUseOnAfterEvent> {
    get itemStack(): ItemStack {
        return this.originalEvent.itemStack;
    }

    get player(): Player | Entity {
        if (!(this.originalEvent.source instanceof Player)) {
            return new Entity(this.originalEvent.source);
        }
        return this.originalEvent.source;
    }

    get target(): Block {
        return this.originalEvent.block;
    }

    get blockFace(): Direction {
        return this.originalEvent.blockFace;
    }
}

export class MinecraftItemStartUseAfter extends MinecraftAfterEvent<ItemStartUseAfterEvent> {
    get itemStack(): ItemStack {
        return this.originalEvent.itemStack;
    }

    get player(): Player | Entity {
        if (!(this.originalEvent.source instanceof Player)) {
            return new Entity(this.originalEvent.source);
        }
        return this.originalEvent.source;
    }

    get useDuration(): Number {
        return this.originalEvent.useDuration;
    }
}

export class MinecraftItemReleaseUseAfter extends MinecraftAfterEvent<ItemReleaseUseAfterEvent> {
    get itemStack(): ItemStack {
        return this.originalEvent.itemStack;
    }

    get player(): Player | Entity {
        if (!(this.originalEvent.source instanceof Player)) {
            return new Entity(this.originalEvent.source);
        }
        return this.originalEvent.source;
    }

    get useDuration(): Number {
        return this.originalEvent.useDuration;
    }
}

export class MinecraftItemDefinitionAfter extends MinecraftAfterEvent<ItemDefinitionTriggeredAfterEvent> {
    get eventName(): string {
        return this.originalEvent.eventName;
    }

    get itemStack(): ItemStack {
        return this.originalEvent.itemStack;
    }

    get player(): Player | Entity {
        if (!(this.originalEvent.source instanceof Player)) {
            return new Entity(this.originalEvent.source);
        }
        return this.originalEvent.source;
    }
}

export class MinecraftItemCompleteUseAfter extends MinecraftAfterEvent<ItemCompleteUseAfterEvent> {
    get itemStack(): ItemStack {
        return this.originalEvent.itemStack;
    }

    get player(): Player | Entity {
        if (!(this.originalEvent.source instanceof Player)) {
            return new Entity(this.originalEvent.source);
        }
        return this.originalEvent.source;
    }

    get useDuration(): Number {
        return this.originalEvent.useDuration;
    }
}

export class MinecraftExplosionAfter extends MinecraftAfterEvent<ExplosionAfterEvent> {
    get dimension(): Dimension {
        return this.originalEvent.dimension;
    }

    get source(): Entity | undefined {
        return this.originalEvent.source ? new Entity(this.originalEvent.source) : undefined;
    }

    public getImpactedBlocks(): Vector3[] {
        return this.originalEvent.getImpactedBlocks();
    }
}

export class MinecraftEntitySpawnAfter extends MinecraftAfterEvent<EntitySpawnAfterEvent> {
    get entity(): Entity {
        return new Entity(this.originalEvent.entity);
    }
}

export class MinecraftEntityRemovedAfter extends MinecraftAfterEvent<EntityRemovedAfterEvent> {
    get removedEntity(): string {
        return this.originalEvent.removedEntity;
    }
}

export class MinecraftEntityHurtAfter extends MinecraftAfterEvent<EntityHurtAfterEvent> {
    get damage(): number {
        return this.originalEvent.damage;
    }

    get damageSource(): EntityDamageSource {
        return this.originalEvent.damageSource;
    }

    get hurtEntity(): Entity | Player {
        if (this.originalEvent.hurtEntity instanceof Player) {
            return new Player(this.originalEvent.hurtEntity);
        }
        return new Entity(this.originalEvent.hurtEntity);
    }
}

export class MinecraftEntityHitEntityAfter extends MinecraftAfterEvent<EntityHitEntityAfterEvent> {
    get damagingEntity(): Entity | Player {
        if (this.originalEvent.damagingEntity instanceof Player) {
            return new Player(this.originalEvent.damagingEntity);
        }
        return new Entity(this.originalEvent.damagingEntity);
    }

    get damagedEntity(): Entity | Player {
        if (this.originalEvent.hitEntity instanceof Player) {
            return new Player(this.originalEvent.hitEntity);
        }
        return new Entity(this.originalEvent.hitEntity);
    }
}

export class MinecraftEntityHitBlockAfter extends MinecraftAfterEvent<EntityHitBlockAfterEvent> {
    get blockFace(): Direction {
        return this.originalEvent.blockFace;
    }

    get damagingEntity(): Entity {
        return new Entity(this.originalEvent.damagingEntity);
    }

    get hitBlock(): Block {
        return this.originalEvent.hitBlock;
    }
}

export class MinecraftEntityHealthChangedAfter extends MinecraftAfterEvent<EntityHealthChangedAfterEvent> {
    get entity(): Entity {
        return new Entity(this.originalEvent.entity);
    }

    get health(): number {
        return this.originalEvent.newValue;
    }

    get oldHealth(): number {
        return this.originalEvent.oldValue;
    }
}

export class MinecraftEffectAddAfter extends MinecraftAfterEvent<EffectAddAfterEvent> {
    get entity(): Entity {
        return new Entity(this.originalEvent.entity);
    }

    get effect(): Effect {
        return this.originalEvent.effect;
    }

    get effectState(): number {
        return this.originalEvent.effectState;
    }
}

export class MinecraftEntityDieAfter extends MinecraftAfterEvent<EntityDieAfterEvent> {
    get damageSource(): EntityDamageSource {
        return this.originalEvent.damageSource;
    }

    get deadEntity(): Entity {
        return new Entity(this.originalEvent.deadEntity);
    }
}

export class MinecraftDataDrivenEntityTriggerEventAfter extends MinecraftAfterEvent<DataDrivenEntityTriggerAfterEvent> {
    get entity(): Entity {
        return new Entity(this.originalEvent.entity);
    }

    get id(): string {
        return this.originalEvent.id;
    }

    getModifiers(): DefinitionModifier[] {
        return this.originalEvent.getModifiers();
    }
}

export class MinecraftBlockExplodeAfter extends MinecraftAfterEvent<BlockExplodeAfterEvent> {
    get explodedBlockPermutation(): BlockPermutation {
        return this.originalEvent.explodedBlockPermutation;
    }

    get source(): Entity {
        return new Entity(this.originalEvent.source);
    }

    get block(): Block {
        return this.block;
    }

    get dimension(): Dimension {
        return this.originalEvent.dimension;
    }
}

export class MinecraftBlockPlaceAfter extends MinecraftAfterEvent<BlockPlaceAfterEvent> {
    get player(): Player {
        return new Player(this.originalEvent.player);
    }

    get block(): Block {
        return this.block;
    }

    get dimension(): Dimension {
        return this.originalEvent.dimension;
    }
}

export class MinecraftBlockBreakAfter extends MinecraftAfterEvent<BlockBreakAfterEvent> {
    get brokenBlockPermutation(): BlockPermutation {
        return this.originalEvent.brokenBlockPermutation;
    }

    get player(): Player {
        return new Player(this.originalEvent.player);
    }

    get block(): Block {
        return this.block;
    }

    get dimension(): Dimension {
        return this.originalEvent.dimension;
    }
}

export class MinecraftButtonPushAfter extends MinecraftAfterEvent<ButtonPushAfterEvent> {
    get source(): Entity {
        return new Entity(this.originalEvent.source);
    }

    get block(): Block {
        return this.block;
    }

    get dimension(): Dimension {
        return this.originalEvent.dimension;
    }
}

export class MinecraftChatSendAfterEvent extends MinecraftAfterEvent<ChatSendAfterEvent> {
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
        console.warn('This is a test, event successfully fired!');
    }
}
