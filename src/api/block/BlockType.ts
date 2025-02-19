import type { Client } from '../client/Client';
import { BlockType as IBlockType, BlockPermutation } from '@minecraft/server';

export class BlockType {
    /**
     * Protected client reference.
     */
    protected readonly _client: Client;
    /**
     * Protected block type to wrap.
     */
    protected readonly _IBlockType: IBlockType;

    /**
     * CraftedAPI wrapped Minecraft BlockType for BeAPIs Block counterpart.
     * @param client Client reference.
     * @param IBlockType Block type to wrap.
     */
    public constructor(client: Client, IBlockType: IBlockType) {
        this._client = client;
        this._IBlockType = IBlockType;
    }

    /**
     * Gets the Minecraft IBlockType being wrapped.
     * @returns
     */
    public getIBlockType(): IBlockType {
        return this._IBlockType;
    }

    /**
     * Gets the block types identifier.
     * @returns
     */
    public getId(): string {
        return this._IBlockType.id;
    }

    /**
     * Can the block have water in it?
     * @returns
     */
    public canBeWaterLogged(): boolean {
        return this._IBlockType.canBeWaterlogged;
    }
}
