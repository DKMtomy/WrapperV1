import { Player } from './player/index';
import { Client } from './client/index';
import { CommandTypes } from './commands/CommandTypes';

const client = new Client();

client.beforeEvents.itemUse.on(event => {
    event.cancel = true;

    if (!(event.source instanceof Player)) return;

    event.source.sendMessage('this worked!!!');

    event.log();
});

client.commands.register('test', 'test', data => {
    data.sendMessage('it works lmfao');
});

client.commands.register('explosion', 'Creates an explosion', sender => {
    client.createExplosion(5, 100, 10, 0, sender.getLocation(), true, true, sender);
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
    }
);


client.afterEvents.chatSend.on((event) => {
    event.sender.sendMessage('this worked!!!');
});

client.afterEvents.entityHitEntity.on((event) => {
    event.damagedEntity.addEffect("speed", 100, 255, true)
});