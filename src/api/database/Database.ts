import { ScoreboardIdentity, ScoreboardIdentityType, ScoreboardObjective, system, world } from '@minecraft/server';

const version = '1.1.3';

const uuid = (): string => {
    const [a, b] = [
        ('00000000000000000' + (Math.random() * 0xffffffffffffffff).toString(16)).slice(-16),
        ('00000000000000000' + (Math.random() * 0xffffffffffffffff).toString(16)).slice(-16)
    ];
    return `${a.slice(0, 8)}-${a.slice(8, 12)}-4${a.slice(13)}-a${b.slice(1, 4)}-${b.slice(4)}`;
};

const allowedTypes = ['string', 'number', 'boolean'];

const encrypt = (data: string, salt: string): string => {
    const encryptedChars: number[] = [];
    for (let i = 0; i < data.length; i++) {
        const charCode = data.charCodeAt(i) + salt.charCodeAt(i % salt.length);
        encryptedChars.push(charCode);
    }
    return String.fromCharCode(...encryptedChars);
};

const decrypt = (encrypted: string, salt: string): string => {
    const decryptedChars: number[] = [];
    for (let i = 0; i < encrypted.length; i++) {
        const charCode = encrypted.charCodeAt(i) - salt.charCodeAt(i % salt.length);
        decryptedChars.push(charCode);
    }
    return String.fromCharCode(...decryptedChars);
};

const CreateCrashReport = (action: 'save' | 'load', data: string, error: Error, salt?: string): void => {
    console.warn(
        `[CraftedDB] Failed to ${action} JSON data.`,
        `\nVersion: ${version}`,
        `\nData: ${data}`,
        `\nSalt: ${salt}`,
        `\nError: ${error.message}`,
        `\n${error.stack}`
    );
};

const DisplayName = {
    parse(text: string, objective: ScoreboardObjective, salt?: string): Record<string, string | number | boolean> {
        try {
            const a = salt ? decrypt(text, salt) : text;
            return JSON.parse(`{${a}}`);
        } catch (error) {
            if (!(error instanceof Error)) throw error;
            try {
                const a = JSON.parse(`"${salt ? decrypt(text, salt) : text}"`);
                const b = JSON.parse(`{${a}}`);
                objective.removeParticipant(text);
                objective.setScore(DisplayName.stringify(b, salt), 0);
                return b;
            } catch {
                CreateCrashReport('load', text, error, salt);
                throw new Error(`Failed to load data. Please check content log file for more info.\n`);
            }
        }
    },
    stringify(value: Record<string, string | number | boolean>, salt?: string): string {
        try {
            const a = JSON.stringify(value).slice(1, -1);
            return salt ? encrypt(a, salt) : a;
        } catch (error) {
            if (!(error instanceof Error)) throw error;
            CreateCrashReport('save', JSON.stringify(value), error, salt);
            throw new Error(`Failed to save data. Please check content log file for more info.\n`);
        }
    }
};

interface CacheData {
    identity: ScoreboardIdentity;
    encoded_value: string;
    decoded_value: string | number | boolean;
}

class CraftedDB implements Map<string, string | number | boolean> {
    private readonly objective: ScoreboardObjective;
    private readonly encrypted: boolean;
    private readonly localState = new Map<string, CacheData>();
    private readonly salt: string | undefined;
    private SYNC_OK = true;

    constructor(id: string, encrypted = false) {
        this.objective = world.scoreboard.getObjective(`crafteddb:${id}`) ?? this.create(id);
        this.encrypted = encrypted;
        this.salt = this.encrypted ? this.objective.displayName : undefined;

        this.updateParticipants();

        system.runInterval(() => {
            const objective = world.scoreboard.getObjective(`crafteddb:${id}`);

            if (objective) {
                if (!this.SYNC_OK) {
                    this.forceSet();
                    console.log(`[CraftedDB] Database '${objective.id.slice(9)}' is now synced.`);
                } else {
                    this.updateParticipants();
                }
                this.SYNC_OK = true;
            } else if (this.SYNC_OK) {
                console.error(`[CraftedDB] There is a sync issue with database '${id}'.`);
                this.SYNC_OK = false;
            }
        });
    }

    create(id: string): ScoreboardObjective {
        system.run(() => {
            world.scoreboard.addObjective(`crafteddb:${id}`, uuid());
        });
        return world.scoreboard.getObjective(`crafteddb:${id}`)!;
    }

    forceSet(): void {
        system.run(() => {
            for (const [, value] of this.localState.entries()) {
                this.objective.setScore(value.encoded_value, 0);
            }
        });
    }

    get size(): number {
        return this.localState.size;
    }

    get objectiveId(): string {
        return this.objective.id;
    }

    clear(): void {
        for (const participant of this.objective.getParticipants()) {
            if (participant.type === ScoreboardIdentityType.FakePlayer) {
                this.objective.removeParticipant(participant);
            }
        }
        this.localState.clear();
    }

    delete(key: string): boolean {
        const participant = this.localState.get(key);
        if (!participant) {
            return false;
        }

        const success = this.objective.removeParticipant(participant.identity);
        this.localState.delete(key);

        return success;
    }

    forEach(callbackfn: (value: string | number | boolean, key: string, crafteddb: this) => void): void {
        for (const [key, value] of this.entries()) {
            callbackfn(value, key, this);
        }
    }

    get(key: string): string | number | boolean | undefined {
        if (!this.localState.has(key)) {
            this.updateParticipants();
        }
        return this.localState.get(key)?.decoded_value;
    }

    has(key: string): boolean {
        return this.localState.has(key);
    }

    set(key: string, value: string | number | boolean): this {
        let this1;
        system.run(() => {
            if (!allowedTypes.includes(typeof value)) {
                throw new TypeError('CraftedDB::set only accepts a value of string, number, or boolean.');
            }
            if (this.localState.get(key)?.decoded_value === value) {
                this1 = this;
            }

            const encoded = DisplayName.stringify({ [key]: value }, this.salt);
            if (encoded.length > 32767) {
                throw new RangeError('CraftedDB::set only accepts a string value less than 32767 characters.');
            }

            const participant = this.localState.get(key);
            if (participant) {
                this.objective.removeParticipant(participant.identity);
            }
            this.objective.setScore(encoded, 0);
            const data = {
                encoded_value: encoded,
                decoded_value: value,
                identity: this.objective.getParticipants().find(participant => participant.displayName === encoded)!
            };
            this.localState.set(key, data);

            this1 = this;
        });

        return this1;
    }

    *entries(): IterableIterator<[string, string | number | boolean]> {
        for (const [key, data] of this.localState.entries()) {
            yield [key, data.decoded_value];
        }
    }

    *keys(): IterableIterator<string> {
        for (const [key] of this.entries()) {
            yield key;
        }
    }

    *values(): IterableIterator<string | number | boolean> {
        for (const [, value] of this.entries()) {
            yield value;
        }
    }

    [Symbol.iterator](): IterableIterator<[string, string | number | boolean]> {
        return this.entries();
    }

    [Symbol.toStringTag]: string = CraftedDB.name;

    private updateParticipants(): void {
        this.localState.clear();
        for (const participant of this.objective.getParticipants()) {
            if (participant.type !== ScoreboardIdentityType.FakePlayer) {
                continue;
            }
            const data = DisplayName.parse(participant.displayName, this.objective, this.salt);
            const key = Object.keys(data)[0];
            const value = data[key];
            this.localState.set(key, {
                identity: participant,
                encoded_value: participant.displayName,
                decoded_value: value
            });
        }
    }
}

export { CraftedDB };
