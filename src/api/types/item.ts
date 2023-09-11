// Type imports.
import { EnchantmentTypes, ItemTypes as IItemTypes } from '@minecraft/server'

/**
 * Get only enchant names on MinecraftEnchantmentTypes.
 */
export type EnchantTypes<T = keyof typeof EnchantmentTypes> = T extends 'prototype' ? never : T

/**
 * Get only item names on MinecraftItemTypes.
 */
export type ItemTypes<T = keyof typeof IItemTypes> = T extends 'prototype' ? never : T
