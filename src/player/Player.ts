import {
    Effect,
    EffectType,
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
    Player as IPlayer,
    Entity as IEntity
} from '@minecraft/server';

import { Entity } from '../entity/index';

export class Player extends Entity {
    /**
     * Protected IPlayer object being wrapped.
     */
    protected readonly _IPlayer: IPlayer;

    constructor(IPlayer: IPlayer) {
        super(IPlayer);
        this._IPlayer = IPlayer;
    }

    public getIEntity(): IEntity {
        return this._IPlayer;
    }
}
