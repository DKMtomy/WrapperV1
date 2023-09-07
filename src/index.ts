import { Client, Client2, CommandTypes, CraftedDB } from './api/index';
import { BlockSignComponent, ItemStack, ItemTypes, system, world } from '@minecraft/server';

const client = new Client();

// client.beforeEvents.itemUse.on(event => {
//     event.cancel = true;

//     if (!(event.source instanceof Player)) return;

//     event.source.sendMessage('this worked!!!');

//     event.log();
// });

client.commands.register('test', 'test', data => {
    data.sendMessage('it works lmfao');
});

client.commands.register('explosion', 'Creates an explosion', sender => {
    client.createExplosion(5, 100, 10, 0, sender.getLocation(), true, true, sender);
});

const client2 = new Client2();

// client.beforeEvents.chatSend.on(event => {
//     event.cancel = true;
// });

console.warn("test")

client2.on('OnChat', event => {
    event.cancel()
    event.sender.sendMessage('it works lmfao');
});

client.commands.register(
    'argtest',
    'Test argument system.',
    {
        string: CommandTypes.String,
        optionalNumber: [CommandTypes.Number, true],
        optionalBoolean: [CommandTypes.Boolean, true]
    },
    (sender, args) => {
        sender.sendMessage(`${args.string} ${args.optionalNumber} ${args.optionalBoolean}`);
    }
);

client.commands.register(
    'aliasargtest',
    'Test argument system with aliases.',
    {
        aliases: ['aat']
    },
    {
        string: CommandTypes.String,
        optionalNumber: [CommandTypes.Number, true],
        optionalBoolean: [CommandTypes.Boolean, true]
    },
    (sender, args) => {
        sender.sendMessage(`${args.string} ${args.optionalNumber} ${args.optionalBoolean}`);
    }
);

client.commands.register(
    'playerargtest',
    'Test player argument system.',
    {
        permissionTags: ['test']
    },
    {
        player: CommandTypes.Player
    },
    (sender, args) => {
        sender.sendMessage(`${args.player.name}`);
        console.log(args.player.getNameTag());
    }
);
