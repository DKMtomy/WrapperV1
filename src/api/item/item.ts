import { ItemStack as IItem, ItemEnchantsComponent, EnchantmentTypes, Enchantment } from '@minecraft/server';
import { Client, EnchantTypes } from '..';
//@ts-expect-error
import { EntityInventory, BlockInventory } from '../inventory/index';

export class Item {
    /**
     * Protected circular client reference.
     */
    protected readonly _client: Client;
    /**
     * Protected IItem being wrapped.
     */
    protected _IItem: IItem;

    /**
     * Item wraps Minecrafts IItem. It adds helpful methods
     * utilizing item components cutting out the complication for
     * you.
     * @param client Client reference.
     * @param IItem Minecraft Item to wrap.
     */
    public constructor(client: Client, IItem: IItem) {
        this._client = client;
        this._IItem = IItem;
    }

    /**
     * Get the wrapped Minecraft item.
     * @returns
     */
    public getIItem(): IItem {
        return this._IItem;
    }

    // /**
    //  * Get the item stack amount.
    //  * @returns
    //  */
    // public getAmount(): number {
    //     return this._IItem.amount;
    // }

    // /**
    //  * Set the item amount.
    //  * @param amount New amount.
    //  */
    // public setAmount(amount: number): void {
    //     this._IItem.amount = amount;
    // }

    // /**
    //  * Get the items name tag.
    //  * @returns
    //  */
    // public getNameTag(): string {
    //     return this._IItem.nameTag;
    // }

    // /**
    //  * Set the items name tag.
    //  * @param nameTag New name.
    //  */
    // public setNameTag(nameTag: string): void {
    //     this._IItem.nameTag = nameTag;
    // }

    // /**
    //  * Get the items lore.
    //  * @returns
    //  */
    // public getLore(): string[] {
    //     return this._IItem.getLore();
    // }

    // /**
    //  * Check if the lore includes the string provided.
    //  * @param lore string to check.
    //  * @returns
    //  */
    // public hasLore(lore: string): boolean {
    //     if (this.getLore().find(x => x === lore)) return true;

    //     return false;
    // }

    // /**
    //  * Set the items lore.
    //  * @param lore Array of lore strings.
    //  */
    // public setLore(lore: string[]): void {
    //     this._IItem.setLore(lore);
    // }

    // /**
    //  * Trigger a Minecraft event on the item.
    //  * @param event Minecraft event to trigger.
    //  */
    // public triggerEvent(event: string): void {
    //     this._IItem.triggerEvent(event);
    // }

    // /**
    //  * Get the items components.
    //  * @TODO create typings
    //  * @returns
    //  */
    // public getComponents(): any[] {
    //     return this._IItem.getComponents();
    // }

    // /**
    //  * Check if the item has a component.
    //  * @param component Component id.
    //  * @returns
    //  */
    // public hasComponent(component: string): boolean {
    //     return this._IItem.hasComponent(component);
    // }

    // /**
    //  * Get a specidic component on the item.
    //  * @param component Component id.
    //  * @TODO create typings
    //  * @returns
    //  */
    // public getComponent(component: string): any {
    //     return this._IItem.getComponent(component);
    // }

    // /**
    //  * Gets all enchants on the item.
    //  * @returns
    //  */
    // public getEnchantments(): Enchantment[] {
    //     // Intitialize enchaments return array.
    //     const enchantments: Enchantment[] = [];

    //     // If not an item or item does not have enchantments nbt component return empty array.
    //     if (!this._IItem || !this._IItem.hasComponent('minecraft:enchantments')) return enchantments;

    //     // Get the enchantment nbt component and typecast it as ItemEnchantsComponent.
    //     const component = this._IItem.getComponent('minecraft:enchantments') as ItemEnchantsComponent;

    //     // For every key on MinecraftEnchantmentTypes execute some code.
    //     for (const enchant of Object.keys(EnchantmentTypes) as (keyof EnchantmentTypes)[]) {
    //         // If not item enchantments has enchant key in current iteration continue to next iteration.
    //         if (!component.enchantments.hasEnchantment(EnchantmentTypes[enchant])) continue;
    //         // Otherwise get level of current enchant on item provided.
    //         const value = component.enchantments.getEnchantment(EnchantmentTypes[enchant]);
    //         // Push data to final enchantment array
    //         enchantments.push(value);
    //     }

    //     // Return enchantments
    //     return enchantments;
    // }

    // /**
    //  * Adds an enchant to the item.
    //  * @param enchantment Enchant name..
    //  * @param level Enchant level.
    //  * @returns true means success
    //  */
    // public addEnchantment(enchantment: EnchantTypes, level: number): boolean {
    //     // If item does not have enchants component return.
    //     if (!this.hasComponent('minecraft:enchantments')) return false;
    //     // Get component from item.
    //     const component = this._IItem.getComponent('minecraft:enchantments') as ItemEnchantsComponent;
    //     // Gets the enchantments
    //     const enchantments = component.enchantments;
    //     // Attempt add the enchantment.
    //     const res = enchantments.addEnchantment(new Enchantment(EnchantmentTypes.get(enchantment), level));
    //     // Sets the enchantments to the component
    //     component.enchantments = enchantments;

    //     // Return result from add enchant.
    //     return res;
    // }

    // /**
    //  * Removes an enchant from the item.
    //  * @param enchantment Enchant name.
    //  * @returns true means success
    //  */
    // public removeEnchantment(enchantment: EnchantTypes): boolean {
    //     // If item does not have enchants component return.
    //     if (!this.hasComponent('minecraft:enchantments')) return false;
    //     // If not item has enchant return false.
    //     if (!this.hasEnchantment(enchantment)) return false;
    //     // Get enchants component.
    //     const component = this._IItem.getComponent('minecraft:enchantments') as ItemEnchantsComponent;
    //     // Gets the enchantments
    //     const enchantments = component.enchantments;
    //     // Remove enchant from enchants component.
    //     enchantments.removeEnchantment(EnchantmentTypes.get(enchantment));
    //     // Sets the enchantments to the component
    //     component.enchantments = enchantments;

    //     // Return true.
    //     return true;
    // }

    // /**
    //  * Checks if item has an enchantment.
    //  * @param enchantment Enchant name.
    //  * @returns
    //  */
    // public hasEnchantment(enchantment: EnchantTypes): boolean {
    //     // If item does not have enchants component return.
    //     if (!this.hasComponent('minecraft:enchantments')) return false;
    //     // Get enchants component.
    //     const component = this._IItem.getComponent('minecraft:enchantments') as ItemEnchantsComponent;

    //     // Return whether enchant exists or no.
    //     return component.enchantments.hasEnchantment(EnchantmentTypes.get(enchantment)) === 0 ? false : true;
    // }

    // /**
    //  * Attempts to get the enchantment from item.
    //  * @param enchantment Enchant name.
    //  * @returns can return `undefined`
    //  */
    // public getEnchantment(enchantment: EnchantTypes): Enchantment | undefined {
    //     // If item does not have enchants component return.
    //     if (!this.hasComponent('minecraft:enchantments')) return;
    //     // If item does not have enchant return.
    //     if (!this.hasEnchantment(enchantment)) return;
    //     // Get enchants component.
    //     const component = this._IItem.getComponent('minecraft:enchantments') as ItemEnchantsComponent;

    //     // Return component enchant provided.
    //     return component.enchantments.getEnchantment(EnchantmentTypes.get(enchantment));
    // }

    // /**
    //  * Set item in inventory or block slot.
    //  * @param slot Slot number
    //  * @param inventory Inventory.
    //  */
    // public setInSlot(slot: number, inventory: EntityInventory | BlockInventory): void {
    //     inventory.setItem(slot, this);
    // }
}
