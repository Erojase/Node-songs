import path from 'path';
import { GlobalKeyboardListener } from "node-global-key-listener";
import { Player } from './player';
import { Playlist } from './playlist';
import { Menu } from './menu';
import { ListenerManager } from './listeners';

export const Keyboard = new GlobalKeyboardListener();

async function main() {
    let player = new Player();

    Menu.player = player;
    await Menu.menu();
    process.stdin.pause();
    Keyboard.addListener(ListenerManager.CreateBind(ListenerManager.mainListener, {player:player}, ListenerManager.mainListenerBind));
}

main();