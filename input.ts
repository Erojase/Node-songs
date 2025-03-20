import { KEYS } from "./keys";

var keypress = require('keypress');

export class Input {

    private stdin: NodeJS.ReadStream & {
        fd: 0;
    }

    constructor() {
        keypress(process.stdin);
        this.stdin = process.stdin;
        this.stdin.setRawMode(true);
        this.stdin.resume();
        this.stdin.setEncoding('utf8');
    }

    public async getCharacter() {
        return new Promise<string>((resolve, reject) => {
            process.stdin.once('keypress', function (ch, key) {
                if (key && key.ctrl && key.name == 'c') {
                    process.exit();
                }
                resolve(key.name);
                return;
            });
        });
    }

    public async getWord(show:boolean) {
        return new Promise<string>((resolve, reject) => {
            let word = "";
            process.stdin.once('keypress', function (ch, key) {
                if (key.name == "return") {
                    resolve(word);
                    process.stdin.pause();
                    return;
                }
                word += key.name;
                if (show) {
                    process.stdout.write(key.name);
                }
            });
        });
    }
}