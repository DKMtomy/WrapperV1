import {
    BlockInventoryComponent,
    BlockLavaContainerComponent,
    BlockLiquidContainerComponent,
    BlockPistonComponent,
    BlockPotionContainerComponent,
    BlockRecordPlayerComponent,
    BlockSignComponent,
    BlockSnowContainerComponent,
    BlockWaterContainerComponent,
    BlockTypes as MinecraftBlockTypes
} from '@minecraft/server';

export interface BlockComponents {
    piston: BlockPistonComponent;
    inventory: BlockInventoryComponent;
    record_player: BlockRecordPlayerComponent;
    lava_container: BlockLavaContainerComponent;
    snow_container: BlockSnowContainerComponent;
    water_container: BlockWaterContainerComponent;
    potion_container: BlockPotionContainerComponent;
    BlockInventoryComponent: BlockInventoryComponent;
    BlockLiquidContainerComponent: BlockLiquidContainerComponent;
    BlockPistonComponent: BlockPistonComponent;
    BlockRecordPlayerComponent: BlockRecordPlayerComponent;
    BlockSignComponent: BlockSignComponent;
}

/**
 * Get only block names on MinecraftBlockTypes.
 */
export type BlockTypes<T = keyof typeof MinecraftBlockTypes> = T extends 'prototype'
    ? never
    : T extends 'get'
    ? never
    : T extends 'getAllBlockTypes'
    ? never
    : T;
