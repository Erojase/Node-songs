import { Input } from "./input";
import { KEYS } from "./keys";
import { Player } from "./player";
import { Playlist } from './playlist';

export class Menu {

    private static Options = {
        "Play Song": Menu.playSong,
        "List Playlists": () => { },
        "Create Playlist": () => { },
        "Play Playlist": () => { },
        "Add Song": Menu.addSong,
        Exit: () => { console.clear(); process.exit(); }
    }

    private static nowPlaying = {
        playing : false,
        songName : ""
    }

    private static input = new Input();

    public static async menu() {
        let optionsKeys = Object.keys(Menu.Options);
        let cursorPos = 0;
        let exit = false;
        while (!exit) {
            console.clear();
            let mainTitle = "Music I Guess";
            let terminalLenght = (process.stdout.columns/2)-(4+mainTitle.length)
            let dashes = "";
            for (let i = 0; i < terminalLenght; i++) {
                dashes += "-";
            }
            process.stdout.write(`<${dashes} ${mainTitle} ${dashes}>\n`);
            process.stdout.write("\n");

            for (let i = 0; i < optionsKeys.length; i++) {
                if (cursorPos == i) {
                    process.stdout.write(`> ${optionsKeys[i]}`);
                } else {
                    process.stdout.write(optionsKeys[i]);
                }
                process.stdout.write('   ');
            }
            
            if (this.nowPlaying.playing) {
                process.stdout.write('\n\n\n\n\n');
                process.stdout.write(`Now playing: ${this.nowPlaying.songName}`);
            }

            switch (await Menu.input.getCharacter()) {
                case KEYS.LEFT:
                    if (cursorPos < 1) {
                        cursorPos = 0;
                    } else {
                        cursorPos--;
                    }
                    break;
                case KEYS.RIGHT:
                    if (cursorPos >= optionsKeys.length - 1) {
                        cursorPos = optionsKeys.length - 1;
                    } else {
                        cursorPos++;
                    }
                    break;
                case KEYS.ENTER:
                    await Menu.Options[optionsKeys[cursorPos]]();
                    break;
                default:
                    break;
            }

        }
    }

    public static async playSong() { 
        console.clear();
        let player = new Player();
        process.stdout.write("Enter the name of the song: ")
        let song = await Menu.input.getWord();
        player.searchAndPlay(song, ()=>{
            Menu.nowPlaying = {
                playing: false,
                songName: ""
            }
        });
        Menu.nowPlaying = {
            playing: true,
            songName: song
        }
    }

    public static async addSong() {
        let playlist = new Playlist();
        let playlists = playlist.ListPlaylists();
        let cursorPos = 0;
        let exit = false;
        while (!exit) {
            console.clear();
            process.stdout.write("<------------------ Select playlist ------------------>\n");

            for (let i = 0; i < playlists.length; i++) {
                const element = playlists[i];
                if (cursorPos == i) {
                    process.stdout.write(`> ${element}\n`);
                } else {
                    process.stdout.write(`${element}\n`);
                }
            }

            switch (await Menu.input.getCharacter()) {
                case KEYS.UP:
                    if (cursorPos < 1) {
                        cursorPos = 0;
                    } else {
                        cursorPos--;
                    }
                    break;
                case KEYS.DOWN:
                    if (cursorPos >= playlists.length - 1) {
                        cursorPos = playlists.length - 1;
                    } else {
                        cursorPos++;
                    }
                    break;
                case KEYS.ENTER:
                    exit = true;
                    process.stdout.write("Enter the name of the song: ")
                    let song = await Menu.input.getWord();
                    await playlist.AddSong(playlists[cursorPos], song);
                    console.log("song added to library");
                    break;
                default:
                    break;
            }
        }

    }
}