import path from 'path';
import {GlobalKeyboardListener} from "node-global-key-listener";
import {Player} from './player';
import { Playlist } from './playlist';
import { ListenerManager } from './listeners';

export const Keyboard = new GlobalKeyboardListener();

const Options = {
    ListPlaylists : "Ctrl + F1 + l",
    CreatePlaylist : "Ctrl + F1 + c",
    PlayPlaylist : "Ctrl + F1 + p",
    AddSong : "Ctrl + F1 + a",
    Exit : "Ctrl + F1 + e"
}
    
function help() {
    console.log("Options:");
    Object.keys(Options).forEach(key => {
        console.log(`${key} \t--->\t ${Options[key]}`);
    });   
}

async function main() {
    let playlist = new Playlist();
    let player = new Player();

    player.play(path.resolve("./temp/A_la_soledad.wav"));

    Keyboard.addListener(ListenerManager.CreateBind(ListenerManager.mainListener, {player:player}, ListenerManager.mainListenerBind));

    help();   
}

main();