// Create original console warn reference.
const log = console.warn;

// Override Default Console Methods
// @ts-expect-error Console expects more methods.
// Gametest only adds warn and error by default we add a few more.
// TODO: Add formatting support for Objects, Array, Etc.
globalThis.console = {
    /**
     * Sends a CraftedAPI log to the content log in-game.
     * @param {any} message Primary message.
     * @param {any} optionalParams Optional extra fragments.
     */
    log(message: any, ...optionalParams: any[]) {
        const formattedParams = optionalParams.map(param => {
            if (typeof param === 'object') {
                try {
                    return JSON.stringify(param, null, 2);
                } catch (e) {
                    return param;
                }
            }
            return param;
        });
        log(`§9[CraftedAPI]§r  §b[LOG]:§r ${message} ${formattedParams.join(' ')}`);
    },
    /**
     * Sends a CraftedAPI error log to the content log in-game.
     * @param {any} message Primary message.
     * @param {any} optionalParams Optional extra fragments.
     */
    error(message: any, ...optionalParams: any[]) {
        log(`§9[CraftedAPI]§r  §c[ERROR]:§r ${message} ${optionalParams.join(' ')}`);
    },
    /**
     * Sends a CraftedAPI warn log to the content log in-game.
     * @param {any} message Primary message.
     * @param {any} optionalParams Optional extra fragments.
     */
    warn(message: any, ...optionalParams: any[]) {
        log(`§9[CraftedAPI]§r  §g[WARN]:§r ${message} ${optionalParams.join(' ')}`);
    },
    /**
     * Sends a CraftedAPI info log to the content log in-game.
     * @param {any} message Primary message.
     * @param {any} optionalParams Optional extra fragments.
     */
    info(message: any, ...optionalParams: any[]) {
        log(`§9[CraftedAPI]§r  §a[INFO]:§r ${message} ${optionalParams.join(' ')}`);
    },
    /**
     * Sends a CraftedAPI debug log to the content log in-game.
     * @param {any} message Primary message.
     * @param {any} optionalParams Optional extra fragments.
     */
    debug(message: any, ...optionalParams: any[]) {
        log(`§9[CraftedAPI]§r  §d[DEBUG]:§r ${message} ${optionalParams.join(' ')}`);
    }
};
