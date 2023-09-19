export interface IEventEmitter {
    addListener(event: string, listener: CallableFunction): void;

    removeListener(event: string, listener: CallableFunction): void;

    removeListeners(event: string): void;

    removeAllListeners(): void;

    envokeEvent(event: string, ...args: unknown[]): void;

    listeners(event: string): CallableFunction[] | undefined;

    listenerCount(event: string): number;

    getMaxListeners(): number;

    setMaxListeners(n: number): void;

    on(event: string, listener: CallableFunction): void;

    off(event: string, listener: CallableFunction): void;

    emit(event: string, ...args: unknown[]): void;

    once(event: string, listener: CallableFunction): void;
}

export class EventEmitter implements IEventEmitter {
    protected readonly _listeners = new Map<string, CallableFunction[]>();
    protected max: number;

    constructor(max = 50) {
        this.max = max;
    }

    public addListener(event: string, listener: CallableFunction): void {
        if (this._listeners.size >= this.max) {
            console.warn(
                `warning: possible EventEmitter memory leak detected. ${this._listeners.size} listeners registered.`
            );
        }
        const listeners = this._listeners.get(event) ?? [];
        this._listeners.set(event, [...listeners, listener]);
    }

    public removeListener(event: string, listener: CallableFunction): void {
        const listeners = this._listeners.get(event);
        if (listeners) {
            const index = listeners.indexOf(listener);
            if (index !== -1) {
                listeners.splice(index, 1);
            }
        }
    }

    public removeListeners(event: string): void {
        this._listeners.delete(event);
    }

    public removeAllListeners(): void {
        this._listeners.clear();
    }

    public envokeEvent(event: string, ...args: unknown[]): void {
        const listeners = this._listeners.get(event);
        if (listeners) {
            for (const listener of listeners) {
                listener(...args);
            }
        }
    }

    public listeners(event: string): CallableFunction[] | undefined {
        return this._listeners.get(event);
    }

    public listenerCount(event: string): number {
        const listeners = this._listeners.get(event);
        return listeners ? listeners.length : 0;
    }

    public getMaxListeners(): number {
        return this.max;
    }

    public setMaxListeners(n: number): void {
        this.max = n;
    }

    public on(event: string, listener: CallableFunction): void {
        this.addListener(event, listener);
    }

    public off(event: string, listener: CallableFunction): void {
        this.removeListener(event, listener);
    }

    public emit(event: string, ...args: unknown[]): void {
        this.envokeEvent(event, ...args);
    }

    public once(event: string, listener: CallableFunction): void {
        const newListener = (...args: unknown[]) => {
            listener(...args);
            this.removeListener(event, newListener);
        };
        this.addListener(event, newListener);
    }
}