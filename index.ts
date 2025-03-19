import path from 'path';
import {GlobalKeyboardListener} from "node-global-key-listener";
import {Player} from './player';
import { Playlist } from './playlist';
import { KEYS } from './keys';

const k = new GlobalKeyboardListener();

let exit = false;

let inputtingWord = false;

// player.searchAndPlay("Gale valley");
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

function menu() {

    console.clear();
    help();
        

}

async function main() {
    let playlist = new Playlist();
    let player = new Player();

    // player.play(path.resolve("./temp/output.wav"));
    player.searchAndPlay("A la soledad");

    k.addListener((e, down) => {
        if (e.rawKey!._nameRaw == KEYS.play_pause && e.state == "UP") {
            player.play_pause();
        }
        if (e.state == "DOWN" && e.name == "A" && down["LEFT CTRL"] && down["F1"]) {
            menu();
            console.log("addSong");
        }

        if (e.state == "DOWN" && e.name == "E" && down["LEFT CTRL"] && down["F1"]) {
            exit = true;
        }
    })

    help();   
}

main();