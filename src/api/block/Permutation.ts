import { BlockPermutation as IPermutation } from '@minecraft/server';
import { Client } from '../client/Client';
import { BlockType } from './BlockType';

export class Permutation {
    /**
     * Circular client reference.
     */
    protected readonly _client: Client;
    /**
     * Minecraft IPermutation to wrap.
     */
    protected readonly _IPermutation: IPermutation;

    /**
     * BeAPI wrapped block permutation. Acts as BeAPI Block and BlockType
     * counterpart. Allows for a smoother block permutation expierence.
     * @param client Client reference.
     * @param IPermutation IPermutation to wrap.
     */
    public constructor(client: Client, IPermutation: IPermutation) {
        this._client = client;
        this._IPermutation = IPermutation;
    }

    /**
     * Get Minecraft IPermutation being wrapped.
     * @returns
     */
    public getIPermutation(): IPermutation {
        return this._IPermutation;
    }

    /**
     * Get BeAPI wrapped block type.
     * @returns
     */
    public getType(): BlockType {
        return new BlockType(this._client, this._IPermutation.type);
    }

    /**
     * Get permutation tags.
     * @returns
     */
    public getTags(): string[] {
        return this._IPermutation.getTags();
    }

    /**
     * Check if permutation has a specific tag.
     * @param tag Tag to check.
     * @returns
     */
    public hasTag(tag: string): boolean {
        return this._IPermutation.hasTag(tag);
    }

    /**
     * Gets permutation block properties.
     * @returns
     */
    public getProperties(): Record<string, boolean | number | string> {
        return this._IPermutation.getAllStates();
    }

    /**
     * Checks if permutation has a specific property.
     * @param property Property to check.
     * @returns Whether the permutation has the specified property.
     */
    public hasProperty(property: string): boolean {
        const properties = this.getProperties();
        if (!properties) return false;

        return property in properties;
    }

    /**
     * Gets a specific property from the permutation.
     * @param property Permutation to get.
     * @returns
     */
    public getProperty(property: string): boolean | number | string | undefined {
        return this._IPermutation.getState(property);
    }

    /**
     * Clones the block permutation creating a seperate reference.
     * @returns
     */
    public clone(): Permutation {
        return new Permutation(this._client, this._IPermutation.clone());
    }
}
