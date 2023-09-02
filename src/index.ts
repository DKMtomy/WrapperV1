import { world as MinecraftWorld } from '@minecraft/server';

import { world as CustomWorld } from './world/index';
import { Entity } from './entity/index';
import { Player } from './player/index';

const customWorld = new CustomWorld(MinecraftWorld);

customWorld.IWorld.afterEvents.chatSend.subscribe((event) => {
    console.warn("aaa");
});
