import { Client, CommandTypes, CraftedDB, Item, Player } from './api/index';
import { BlockSignComponent, EnchantmentTypes, ItemStack, ItemTypes, system, world } from '@minecraft/server';

const client = new Client();

client.commands.register('test', 'test', data => {
    data.sendMessage('it works lmfao');
});

client.commands.register('explosion', 'Creates an explosion', sender => {});

client.on('OnChat', event => {
    if (event.message.startsWith(client.commands.getPrefix())) return;
    event.cancel();
    console.log(event.sender.executeCommand('weather query'));
});

client.on('playerUseItem', event => {
    client.executeCommand(`say ${event.source.name} used ${event.item.getId()}`);
});

client.commands.register('enchant', 'add an enchantment to the item you are holding', sender => {
    const item = new Item(client, sender.mainhandItem);

    item.addEnchantment('unbreaking', 1);
});

client.on('Tick', event => {
    if (event.currentTick % 20 === 0) {
        console.log(event.currentTick);
    }
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

client.on('BlockCreated', event => {
    console.log(event.block.isWaterLogged());
});

client.on('OnJoin', event => {
    event.executeCommand('say hi');
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
        args.player.setScore('idk', 100);
    }
);
