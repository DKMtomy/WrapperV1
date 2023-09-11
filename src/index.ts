import { Client, CommandTypes, CraftedDB, Player } from './api/index';
import { BlockSignComponent, ItemStack, ItemTypes, system, world } from '@minecraft/server';

const client = new Client();

client.commands.register('test', 'test', data => {
    data.sendMessage('it works lmfao');
});

client.commands.register('explosion', 'Creates an explosion', sender => {
    client.createExplosion(5, 100, 10, 0, sender.getLocation(), true, true, sender);
});

// client.beforeEvents.chatSend.on(event => {
//     event.cancel = true;
// });

client.on('OnChat', event => {
    event.cancel();
    event.sender.sendMessage('it works lmfao');
});

client.on('playerUseItem', event => {
    // console.warn('test');
    event.cancel();
    if (!(event.source instanceof Player)) return;
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

client.on('blockCreated', event => {
});

client.on("OnJoin", event => {
    event.executeCommand("say hi");
});

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
