// This will contain a multitude of errors
// Alot of conflicts with @types/node.
// Please bear with us
export {}

// @ts-ignore
declare global {
  interface Console {
    /**
     * Sends a CraftedAPi log to the content log in-game.
     * @param {any} message Primary message.
     * @param {any} optionalParams Optional extra fragments.
     */
    // @ts-ignore
    log: (message: any, ...optionalParams: any[]) => void
    /**
     * Sends a CraftedAPi error log to the content log in-game.
     * @param {any} message Primary message.
     * @param {any} optionalParams Optional extra fragments.
     */
    // @ts-ignore
    warn: (message: any, ...optionalParams: any[]) => void
    /**
     * Sends a CraftedAPi warn log to the content log in-game.
     * @param {any} message Primary message.
     * @param {any} optionalParams Optional extra fragments.
     */
    // @ts-ignore
    error: (message: any, ...optionalParams: any[]) => void
    /**
     * Sends a CraftedAPi info log to the content log in-game.
     * @param {any} message Primary message.
     * @param {any} optionalParams Optional extra fragments.
     */
    // @ts-ignore
    info: (message: any, ...optionalParams: any[]) => void
    /**
     * Sends a CraftedAPi debug log to the content log in-game.
     * @param {any} message Primary message.
     * @param {any} optionalParams Optional extra fragments.
     */
    // @ts-ignore
    debug: (message: any, ...optionalParams: any[]) => void
    // @ts-ignore
  }
  /**
   * CraftedAPi console override.
   * The only methods supported are `log | error | warn | info | debug`!
   * All logs will be piped to content log ingame with formatting.
   */
  // @ts-expect-error
  const console: Console

  const require: undefined

  /**
   * CraftedAPi gametest compatible timeout. **Uses ticks not milliseconds!**
   * @param callback Callback function to be called.
   * @param tick Timeout in ticks.
   */
  // @ts-ignore
  function setTimeout(callback: CallableFunction, tick: number): number
  /**
   * CraftedAPi gametest compatible interval. **Uses ticks not milliseconds!**
   * @param callback Callback function to be called.
   * @param tick Interval in ticks.
   */
  // @ts-ignore
  function setInterval(callback: CallableFunction, tick: number): number
  /**
   * CraftedAPi gametest clear timeout.
   * Kills a timeout before it can be executed.
   * @param id Id of the timeout.
   */
  // @ts-ignore
  function clearTimeout(id: number): void
  /**
   * CraftedAPi gametest clear interval.
   * Kills a interval before it can be executed.
   * @param id Id of the interval.
   */
  // @ts-ignore
  function clearInterval(id: number): void
}