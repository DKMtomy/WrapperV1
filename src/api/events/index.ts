import { BlockCreated } from './BlockCreated';
import { ItemUse } from './ItemUse';
import { Jump } from './Jump';
import { Land } from './Land';
import { OnChat } from './OnChat';
import { OnJoin } from './OnJoin';
import { ScriptEventReceive } from './ScriptEventReceive';
import { Tick } from './Tick';

export const events = [OnChat, ItemUse, BlockCreated, OnJoin, Tick, ScriptEventReceive, Jump, Land];
