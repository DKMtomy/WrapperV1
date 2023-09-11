// import {
//     type Client,
//     type DimensionNamespace,
//     type ServerCommandResponse,
//     type Item,
//     type Location,
//     type Entity,
//     type BlockTypes,
//     type camelCaseToSnakeCase,
//     type ExplosionOptions,
//     type ParticleOptions,
//     type Player,
//     Block,
//     Vec3,
//     CamelToSnakeCase
// } from '..';

// import {
//     Block as IBlock,
//     Dimension as IDimension,
//     Vector3,
//     ExplosionOptions as IExplosionOptions,
//     MolangVariableMap,
//     Color,
//     Vector
// } from '@minecraft/server';

// export class Dimension {
//     /**
//      * Client reference.
//      */
//     protected readonly _client: Client;
//     /**
//      * IDimension being wrapped.
//      */
//     protected readonly _IDimension: IDimension;

//     /**
//      * BeAPI wrapper for Minecraft dimension. Enables for easier centralized usage
//      * of a dimension.
//      * @param client Client reference.
//      * @param IDimension IDimension to wrap.
//      */
//     public constructor(client: Client, IDimension: IDimension) {
//         this._client = client;
//         this._IDimension = IDimension;
//     }

//     /**
//      * Gets the vanilla dimension class.
//      * @returns {IDimension}
//      */
//     public getIDimension(): IDimension {
//         return this._IDimension;
//     }

//     /**
//      * Gets the id of the dimension.
//      * @returns {DimensionNamespace}
//      */
//     public getId(): DimensionNamespace {
//         return this._IDimension.id as DimensionNamespace;
//     }

//     /**
//      * Executes a command in the dimension.
//      * @param {string} cmd Command to execute.
//      * @param {boolean} debug Option to log command results.
//      * @returns {ServerCommandResponse} Returns the command response.
//      */
//     public executeCommand(cmd: string, debug = false): ServerCommandResponse {
//         try {
//             // Try execute command.
//             const command = this._IDimension.runCommand(cmd);

//             // If able to return ServerCommandResponse
//             // Then successful execute
//             return {
//                 successCount: command.successCount,
//                 data: command,
//                 err: false
//             };
//         } catch (error) {
//             // If debug error then do so.
//             if (debug) console.debug(`[runCommand] [error] (standalone): ${String(error)}`);

//             // Return error data.
//             return {
//                 successCount: 0,
//                 data: null,
//                 err: true
//             };
//         }
//     }

//     // /**
//     //  * Spawn an item.
//     //  * @param {Item} item Item class to spawn.
//     //  * @param {Location} location Location to spawn item.
//     //  * @returns {Entity | undefined} Returns the spawned item.
//     //  */
//     // public spawnItem(item: Item, location: Location): Entity | undefined {
//     //     try {
//     //         this._IDimension.spawnItem(item.getIItem(), new Vec3(location.x, location.y, location.z));

//     //         return this._client.entities.getLastest();
//     //     } catch {
//     //         return undefined;
//     //     }
//     // }

//     // /**
//     //  * Spawn an entity.
//     //  * @param {string} id Entity identifier.
//     //  * @param {Location} location Location to spawn entity.
//     //  * @returns {Entity | undefined} Returns the spawned entity.
//     //  */
//     // public spawnEntity(entity: CamelToSnakeCase<EntityTypes>, location: Location): Entity | undefined {
//     //     try {
//     //         this._IDimension.spawnEntity(entity, new Vec3(location.x, location.y, location.z));

//     //         return this._client.entities.getLastest();
//     //     } catch {
//     //         return undefined;
//     //     }
//     // }

//     /**
//      * Spawn a particle.
//      * @param {string} id Particle identifier.
//      * @param {Location} location Location to spawn particle.
//      */
//     public spawnParticle(id: string, location: Location, options?: ParticleOptions[]): void {
//         let color: Color;
//         color.alpha = 0;
//         color.red = 0;
//         color.green = 0;
//         color.blue = 0;
//         const variableMap = new MolangVariableMap();
//         if (options) {
//             for (const option of options) {
//                 switch (option.type) {
//                     case 'RGB':
//                         variableMap.setColorRGB(option.id, option.color ?? color);
//                         break;
//                     case 'RGBA':
//                         variableMap.setColorRGBA(option.id, option.color ?? color);
//                         break;
//                     case 'SpeedAndDirection':
//                         variableMap.setSpeedAndDirection(
//                             option.id,
//                             option.speed ?? 0,
//                             option.vector ?? new Vector(0, 0, 0)
//                         );
//                         break;
//                     case 'Vector':
//                         variableMap.setVector3(option.id, option.vector ?? new Vector(0, 0, 0));
//                         break;
//                 }
//             }
//         }

//         this._IDimension.spawnParticle(id, new Vec3(location.x, location.y, location.z), variableMap);
//     }

//     /**
//      * Get all the players in the dimension.
//      * @returns {Player[]}
//      */
//     // public getPlayers(): Player[] {
//     //     return this._client.players.getAllAsArray().filter((x: Player) => x.getDimension().id === this.getId());
//     // }

//     // /**
//     //  * Get all entities in the dimension.
//     //  * @returns {Entity[]}
//     //  */
//     // public getEntities(): Entity[] {
//     //     return this._client.entities.getAllAsArray().filter((x: Entity) => x.getDimension().id === this.getId());
//     // }

//     /**
//      * Get a block in the dimension.
//      * @param {Location} location Location of the block.
//      * @returns {Block} Returns the block.
//      */
//     public getBlock(location: Location | IBlock): Block {
//         if (location instanceof IBlock) {
//             return new Block(this._client, location);
//         }

//         return new Block(this._client, this._IDimension.getBlock(new Vec3(location.x, location.y, location.z)));
//     }

//     /**
//      * Set a block in the dimension.
//      * @param location Location to set the block.
//      * @param type The block type to set.
//      * @returns {Block} Returns the set block.
//      */
//     public setBlock(location: Location, block: CamelToSnakeCase<BlockTypes> | Block): Block {
//         const selected = this.getBlock(location);
//         // If is a block create a permutation on the location.
//         if (block instanceof Block) {
//             selected.setType(block.getType());
//             selected.setPermutation(block.getPermutation());
//             return selected;
//         }
//         // Otherwise change the type to given type.
//         selected.setType(block);
//         return selected;
//     }

//     /**
//      * Creates a explosion in the dimension.
//      * @param {Location} location Location of the explosion.
//      * @param {number} radius Radius of the explosion.
//      */
//     public createExplosion(location: Location, radius: number, options?: ExplosionOptions): void {
//         let explosionOptions: IExplosionOptions;
//         if (options) {
//             explosionOptions.allowUnderwater = options.allowUnderwater;
//             explosionOptions.breaksBlocks = options.breaksBlocks;
//             explosionOptions.causesFire = options.causesFire;
//             explosionOptions.source = options.source.getIEntity();
//         }

//         this._IDimension.createExplosion(new Vec3(location.x, location.y, location.z), radius, explosionOptions);
//     }
// }
