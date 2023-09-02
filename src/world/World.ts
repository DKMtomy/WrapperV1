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
    ItemComponent
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
}
