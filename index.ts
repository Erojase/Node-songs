import path from 'path';
import { GlobalKeyboardListener } from "node-global-key-listener";
import { Player } from './player';
import { Playlist } from './playlist';
import { Menu } from './menu';

export const Keyboard = new GlobalKeyboardListener();

async function main() {
    let player = new Player();

    await Menu.menu();
    process.stdin.pause();
    // Keyboard.addListener(ListenerManager.CreateBind(ListenerManager.mainListener, {player:player}, ListenerManager.mainListenerBind));
}

main();