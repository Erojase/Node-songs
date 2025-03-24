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

    public async getWord() {
        let word = "";
        let exit = false;
        return new Promise<string>(async (resolve, reject) => {
            while (!exit) {
                let char = await this.getCharacter();              
                if (char == "return") {
                    exit = true;
                }else if (char == "backspace") {
                    word = word.substring(0, word.length-1);
                } else if (char == "space") {
                    word += " ";
                    process.stdout.write(" ");
                } else {
                    word += char;
                    process.stdout.write(char);
                }
            }
            process.stdout.write("\n");
            resolve(word);
            return;
        });
    }
}