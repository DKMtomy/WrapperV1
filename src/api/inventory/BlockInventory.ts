// Imports
import { Item } from '../item/index';
import type { Client } from '..';
import type { BlockInventoryComponent as IInventory, Container as IContainer, ItemStack } from '@minecraft/server';
import { EntityInventory } from './EntityInventory';

// Class
export class BlockInventory {
    // Protected properties
    protected readonly _client: Client;
    protected readonly _IInventory: IInventory;
    protected readonly _IContainer: IContainer;

    // Constructor
    /**
     * Construct new BlockInventory
     * @param client Client instance
     * @param IInventory Inventory to wrap
     */
    public constructor(client: Client, IInventory: IInventory) {
        this._client = client;
        this._IInventory = IInventory;
        this._IContainer = IInventory.container;
    }

    /**
     * Get the IInventory component being wrapped
     * @returns IInventory
     */
    public getIInventory(): IInventory {
        return this._IInventory;
    }

    /**
     * Get the IContainer component being wrapped
     * @returns IContainer
     */
    public getIContainer(): IContainer {
        return this._IContainer;
    }

    /**
     * Get the container size
     * @returns Number
     */
    public getSize(): number {
        return this._IContainer.size;
    }

    /**
     * Get number of empty slots
     * @returns Number
     */
    public getEmptySlots(): number {
        return this._IContainer.emptySlotsCount;
    }

    /**
     * Get item in specified slot
     * @param slot Slot number
     * @returns Item
     */
    public getItem(slot: number): ItemStack {
        return this._IContainer.getItem(slot)
    }

    /**
     * Set item in specified slot
     * @param slot Slot number
     * @param item Item to set
     */
    public setItem(slot: number, item: Item): void {
        this._IContainer.setItem(slot, item.getIItem());
    }

    /**
     * Add item to container
     * @param item Item to add
     * @returns ItemStack result
     */
    public addItem(item: Item): ItemStack {
        return this._IContainer.addItem(item.getIItem());
    }

    /**
     * Transfer item between inventories
     * @param slot Source slot
     * @param otherSlot Destination slot
     * @param inventory Destination inventory
     */
    public transferItem(slot: number, otherSlot: number, inventory: BlockInventory | EntityInventory): void {
        this._IContainer.swapItems(slot, otherSlot, inventory.getIContainer());
    }

    /**
     * Swap two item slots in inventory
     * @param slot First slot
     * @param otherSlot Second slot
     */
    public swapItem(slot: number, otherSlot: number): void {
        this._IContainer.swapItems(slot, otherSlot, this._IContainer);
    }
}
