import path from 'path';
import { GlobalKeyboardListener } from "node-global-key-listener";
import { Player } from './player';
import { Playlist } from './playlist';
import { ListenerManager } from './listeners';
import { Input } from './input';
import { KEYS } from './keys';

export const Keyboard = new GlobalKeyboardListener();

const Options = {
    ListPlaylists: ()=>{},
    CreatePlaylist: ()=>{},
    PlayPlaylist: ()=>{},
    AddSong: (playlistName: string, song: string)=>{},
    Exit: process.exit
}

function help() {
    console.log("Options:");
    Object.keys(Options).forEach(key => {
        console.log(`${key} \t--->\t ${Options[key]}`);
    });
}

async function menu() {
    let input = new Input();
    let optionsKeys = Object.keys(Options);
    let cursorPos = 0;
    while (true) {
        console.clear();
        process.stdout.write("<------------------ Music I Guess ------------------>\n");
        process.stdout.write("\n");

        for (let i = 0; i < optionsKeys.length; i++) {
            if (cursorPos == i) {
                process.stdout.write(`<${optionsKeys[i]}>`);
            } else {
                process.stdout.write(optionsKeys[i]);
            }
            process.stdout.write('   ');
        }

        switch (await input.getCharacter()) {
            case KEYS.LEFT:
                if (cursorPos < 1) {
                    cursorPos = 0;
                } else {
                    cursorPos--;
                }
                break;
            case KEYS.RIGHT:
                if (cursorPos >= optionsKeys.length-1) {
                    cursorPos = optionsKeys.length-1;
                } else {
                    cursorPos++;
                }
                break;
            case KEYS.ENTER:
                Options[optionsKeys[cursorPos]]();
                break;
            default:
                break;
        }

    }
}

async function main() {
    let playlist = new Playlist();
    let player = new Player();

    Options.AddSong = playlist.AddSong;

    // player.play(path.resolve("./temp/A_la_soledad.wav"));

    await menu();

    // Keyboard.addListener(ListenerManager.CreateBind(ListenerManager.mainListener, {player:player}, ListenerManager.mainListenerBind));
}

main();