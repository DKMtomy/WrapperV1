import { Player } from './player/index';
import { Client } from './world/index';

const client = new Client()

client.beforeEvents.itemUse.subscribe(event => {
    event.cancel = true;

    if (!(event.source instanceof Player)) return;

    event.source.sendMessage("this worked!!!")

    event.log()
})

client.afterEvents.chatSend.subscribe(event => {

    if (!(event.sender instanceof Player)) return;

    event.sender.sendMessage("this worked!!!")

    event.afterEvent()
})