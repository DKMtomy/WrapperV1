import {
    Effect,
    EffectType,
    Entity as IEntity,
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
    EntityOnFireComponent,
    Container
} from '@minecraft/server';

import { Vec3 } from '../vector/index';

const { lerp, add } = Vector;

type PropertyValue = boolean | number | string | undefined;

export class Entity {
    /**
     * Protected IEntity object being wrapped.
     */
    protected readonly _IEntity: IEntity;

    constructor(IEntity: IEntity) {
        this._IEntity = IEntity;
    }

    public destroy(): void {
        try {
            this._IEntity.kill();
        } catch {}
    }

    /**
     * Gets the entities Minecraft Mojang IEntity object.
     * @returns
     */
    public getIEntity(): IEntity {
        return this._IEntity;
    }

    /**
     * Gets the entities ID *(non persistant)*
     * @returns
     */
    public getId(): string {
        return this._IEntity.id;
    }

    /**
     * Gets the entities name tag.
     * @returns
     */
    public getNameTag(): string {
        return this._IEntity.nameTag;
    }

    /**
     * Sets the entities name tag.
     * @param nametag New name tag for entity.
     */
    public setNameTag(nametag: string): void {
        this._IEntity.nameTag = nametag;
    }

    /**
     * Gets the entities sneak status.
     * @returns
     */
    public isSneaking(): boolean {
        return this._IEntity.isSneaking;
    }

    /**
     * Gets all tags on the entity.
     * @returns
     */
    public getTags(): string[] {
        return this._IEntity.getTags();
    }

    /**
     * Checks if entity has a tag.
     * @param tag Tag to check.
     * @returns
     */
    public hasTag(tag: string): boolean {
        return this._IEntity.hasTag(tag);
    }

    /**
     * Adds a tag to the entity.
     * @param tag Tag to add.
     * @returns `true` mean success.
     */
    public addTag(tag: string): boolean {
        return this._IEntity.addTag(tag);
    }

    /**
     * Removes a tag from the entity.
     * @param tag Tag to remove.
     * @returns `true` mean success.
     */
    public removeTag(tag: string): boolean {
        return this._IEntity.removeTag(tag);
    }

    /**
     * Executes a command as the entity.
     * @param cmd Command to run.
     * @returns
     */
    public async executeCommand(cmd: string): Promise<CommandResult> {
        try {
            const command = await this._IEntity.runCommandAsync(cmd);
            return {
                successCount: command.successCount
            };
        } catch (error) {
            console.error(`Failed to execute command: ${cmd}`, error);
            throw new Error('Command execution failed');
        }
    }

    /**
     * Attempts to get the score of then entity on an objective.
     * @param objective Objective to use.
     * @returns
     */
    public getScore(objective: string): number {
        try {
            return world.scoreboard.getObjective(objective).getScore(this._IEntity) ?? 0;
        } catch {
            return 0;
        }
    }

    /**
     * Attempts to set the score of the entity on an objective.
     * @param objective Objective to use.
     * @param amount New score.
     * @returns
     */
    public setScore(objective: string, amount: number): number {
        this.executeCommand(`scoreboard players set @s "${objective}" ${amount}`);

        return this.getScore(objective);
    }

    /**
     * Attempts to add score to the entity on an objective.
     * @param objective Objective to use.
     * @param amount Amount to add.
     * @returns
     */
    public addScore(objective: string, amount: number): number {
        this.executeCommand(`scoreboard players add @s "${objective}" ${amount}`);

        return this.getScore(objective);
    }

    /**
     * Attempts to remove score from the entity on an objective.
     * @param objective Objective to use.
     * @param amount Amount to remove.
     * @returns
     */
    public removeScore(objective: string, amount: number): number {
        this.executeCommand(`scoreboard players remove @s "${objective}" ${amount}`);

        return this.getScore(objective);
    }

    /**
     * Gets the entities current location.
     * @returns
     */
    public getLocation(): Vector3 {
        const pos = this._IEntity.location;

        return {
            x: Math.floor(pos.x),
            y: Math.floor(pos.y),
            z: Math.floor(pos.z)
        };
    }

    /**
     * Gets precise location (decimals)
     * @returns
     */
    public getPreciseLocation(): Vector3 {
        const pos = this._IEntity.location;

        return {
            x: pos.x,
            y: pos.y,
            z: pos.z
        };
    }

    /**
     * Gets the entities current dimension.
     * @returns
     */
    public getDimension(): Dimension {
        return this._IEntity.dimension;
    }

    /**
     * Gets the entities inventory.
     * @returns can return `undefined`
     */
    public getInventory(): EntityInventoryComponent {
        if (!this._IEntity.hasComponent('minecraft:inventory')) return;

        return this._IEntity.getComponent('minecraft:inventory') as EntityInventoryComponent;
    }

    /**
     * Gets entites selected slot.
     * @returns
     */
    public getSelectedSlot(): ContainerSlot {
        const selectedSlot = this._IEntity.getComponent(
            EntityEquipmentInventoryComponent.componentId
        ) as EntityEquipmentInventoryComponent;

        return selectedSlot.getEquipmentSlot(EquipmentSlot.mainhand);
    }

    /**
     * Gets the entities health.
     * @returns
     */
    public getHealth(): EntityHealthComponent {
        return this._IEntity.getComponent(EntityHealthComponent.componentId) as EntityHealthComponent;
    }

    /**
     * Get the entities velocity.
     * @returns
     */
    public getVelocity(): Vector3 {
        return this._IEntity.getVelocity();
    }

    /**
     * Set the entities velocity.
     * @param velocity New velocity.
     */
    public setVelocity(velocity: Vector3): void {
        this._IEntity.clearVelocity();
        this._IEntity.applyImpulse(velocity);
    }

    /**
     * Teleports the entity.
     * @param location Location to teleport entity to.
     * @param dimension Dimension to teleport entity to.
     * @param xrot X rotation to face when teleported.
     * @param yrot Y rotation to face when teleported
     */
    public teleport(
        location: Vector3,
        checkForBlocks: boolean,
        dimension: Dimension,
        facingLocation?: Vector3,
        keepVelocity?: boolean,
        rotation?: Vector2
    ): void {
        const loc = new Vec3(location.x, location.y, location.z);
        if (dimension instanceof Dimension) {
            this._IEntity.teleport(loc, {
                checkForBlocks,
                dimension,
                facingLocation,
                keepVelocity,
                rotation
            });
        } else {
            this._IEntity.teleport(loc);
        }
    }

    /**
     * Trigger an event on the entity.
     * @param event Minecraft player event.
     */
    public triggerEvent(event: string): void {
        this._IEntity.triggerEvent(event);
    }

    /**
     * Get the entities rotation.
     * @returns
     */
    public getRotation(): Vector2 {
        return this._IEntity.getRotation();
    }

    /**
     * Set the rotation of the entity.
     * @param rotation
     */
    public setRotation(rotation: Vector2): void {
        this._IEntity.setRotation({
            x: rotation.x ?? this.getRotation()?.x ?? 0,
            y: rotation.y ?? this.getRotation()?.y ?? 0
        });
    }

    /**
     * Get the entities head location.
     * @returns
     */
    public getHeadLocation(): Vector3 {
        return this._IEntity.getHeadLocation();
    }

    /**
     * Adds a potion effect to the entity.
     * @param effect Minecraft EffectType.
     * @param duration Length effect should last.
     * @param amplifier Amplifier of effect.
     * @returns
     */
    public addEffect(effect: EffectType, duration: number, amplifier?: number, showParticles?: boolean): void {
        return this._IEntity.addEffect(effect, duration, {
            amplifier,
            showParticles
        });
    }

    /**
     * Gets a potion effect on the entity.
     * @param effect Minecraft EffectType.
     * @returns
     */
    public getEffect(effect: EffectType): Effect {
        return this._IEntity.getEffect(effect);
    }

    /**
     * Gets a property on the Entity.
     * @param {id} id ID of property.
     * @returns {PropertyValue} Value of the property.
     */
    public getProperty(id: string): PropertyValue {
        return this._IEntity.getDynamicProperty(id);
    }

    /**
     * Sets the value of a property.
     * @param {id} id ID of property.
     * @param {PropertyValue} value Value for the property.
     * @returns {boolean}
     */
    public setProperty(id: string, value: PropertyValue): void {
        return this._IEntity.setDynamicProperty(id, value);
    }

    /**
     * Removes a property.
     * @param {string} id ID of property.
     * @returns {boolean}
     */
    public removeProperty(id: string): boolean {
        return this._IEntity.removeDynamicProperty(id);
    }

    /**
     * Gets the Item instance if the entity is a item.
     * @returns {Item | undefined} Item instance.
     */
    public getItemStack(): ItemStack | undefined {
        if (!this._IEntity.hasComponent('minecraft:item')) return;
        const component = this._IEntity.getComponent('minecraft:item') as ItemComponent;
        const item = new ItemStack(component.typeId);

        return item;
    }

    public get entityLocation(): Vec3 {
        return Vec3.from(this._IEntity.location);
    }

    public getViewDirection(): Vec3 {
        return Vec3.from(this._IEntity.getViewDirection());
    }

    public get isBurning(): boolean {
        return this._IEntity.hasComponent(EntityOnFireComponent.componentId);
    }

    public get inventory(): EntityInventoryComponent {
        return this._IEntity.getComponent(EntityInventoryComponent.componentId) as EntityInventoryComponent;
    }

    public get container(): Container {
        const I = this._IEntity.getComponent(EntityInventoryComponent.componentId) as EntityInventoryComponent;

        return I.container;
    }

    public get equipment(): EntityEquipmentInventoryComponent {
        return this._IEntity.getComponent(
            EntityEquipmentInventoryComponent.componentId
        ) as EntityEquipmentInventoryComponent;
    }

    public get mainhandItem(): ItemStack {
        return this.equipment.getEquipment(EquipmentSlot.mainhand);
    }

    public set mainhandItem(item: ItemStack | ContainerSlot) {
        const inv = this._IEntity.getComponent(
            EntityEquipmentInventoryComponent.componentId
        ) as EntityEquipmentInventoryComponent;

        inv.setEquipment(EquipmentSlot.mainhand, item instanceof ContainerSlot ? item.getItem() : item);
    }

    get offhandItem(): ItemStack {
        const inv = this._IEntity.getComponent(
            EntityEquipmentInventoryComponent.componentId
        ) as EntityEquipmentInventoryComponent;

        return inv.getEquipment(EquipmentSlot.offhand);
    }

    set offhandItem(item: ItemStack | ContainerSlot) {
        const inv = this._IEntity.getComponent(
            EntityEquipmentInventoryComponent.componentId
        ) as EntityEquipmentInventoryComponent;

        inv.setEquipment(EquipmentSlot.offhand, item instanceof ContainerSlot ? item.getItem() : item);
    }

    get offhandSlot(): ContainerSlot {
        const inv = this._IEntity.getComponent(
            EntityEquipmentInventoryComponent.componentId
        ) as EntityEquipmentInventoryComponent;

        return inv.getEquipmentSlot(EquipmentSlot.offhand);
    }

    public getInventoryEquipment(): EntityEquipmentInventoryComponent {
        if (!this._IEntity.hasComponent('equipment_inventory')) return;

        return this._IEntity.getComponent('equipment_inventory') as EntityEquipmentInventoryComponent;
    }

    public throwEntity(entityTypeIdThrowable: string, speedScale: number = 1, spreadFactor: number = 0): IEntity {
        let head = undefined;

        try {
            head = this._IEntity.getHeadLocation();
        } catch {
            console.warn("player doesnt exist can't get head location");
        } // boss is dead
        const view = this._IEntity.getViewDirection();

        const loc = lerp(head, add(head, view), 1.5); // lerp stuff

        const entityThrown = world.getDimension('overworld').spawnEntity(entityTypeIdThrowable, loc);

        const offsetX = (Math.random() * 2 - 1) * spreadFactor;
        const offsetY = (Math.random() * 2 - 1) * spreadFactor;
        const offsetZ = (Math.random() * 2 - 1) * spreadFactor;

        const snowballVelocity = {
            x: (view.x + offsetX) * speedScale,
            y: (view.y + offsetY) * speedScale,
            z: (view.z + offsetZ) * speedScale
        };

        entityThrown.applyImpulse(snowballVelocity);
        return entityThrown;
    }
}
