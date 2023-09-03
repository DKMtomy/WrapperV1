import { ChatSendBeforeEvent, WorldBeforeEvents } from '@minecraft/server';
import { Player } from '../player/index';

export class MyWorldBeforeEvents {
    private originalEvents: WorldBeforeEvents;

    constructor(originalEvents: WorldBeforeEvents) {
        this.originalEvents = originalEvents;
    }

    subscribeChatSend(callback: (event: MyChatSendBeforeEvent) => void) {
        this.originalEvents.chatSend.subscribe(originalEvent => {
            const myEvent = new MyChatSendBeforeEvent(originalEvent);
            callback(myEvent);
        });
    }
}

export class MyChatSendBeforeEvent {
    private originalEvent: ChatSendBeforeEvent;

    constructor(originalEvent: ChatSendBeforeEvent) {
        this.originalEvent = originalEvent;
    }

    get message(): string {
        console.warn(this.originalEvent.message);
        return this.originalEvent.message;
    }

    set message(newMessage: string) {
        this.originalEvent.message = newMessage;
    }

    get sender(): Player {
        return new Player(this.originalEvent.sender);
    }

    get sendToTargets(): boolean {
        return this.originalEvent.sendToTargets;
    }

    test(): void {
        this.sender.sendMessage('it works lmfao');
    }

    getTargets(): Player[] {
        return this.originalEvent.getTargets().map(player => new Player(player));
    }

    // ... other properties and methods
}
