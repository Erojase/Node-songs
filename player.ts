import { ChildProcess, execFile } from 'child_process';
import fs from 'fs';
import path from 'path';

export enum PlayerState{
    Idle = 0,
    Paused = 1,
    Playing = 2
}

export class Player {

    private readonly dir;

    private readonly ytUrlPrefix = "https://www.youtube.com/watch?v=";

    public volume = 100;

    private startTime = 0;

    private currentTime = 0;

    private currentSongProcess: ChildProcess;

    private playerState = PlayerState.Idle;

    private currentSongPath = "";

    constructor(){
        this.dir = path.resolve("./temp") + "/";
        if (!fs.existsSync(this.dir)) {
            fs.mkdirSync(this.dir)
        }
    }

    public async searchAndPlay(keyword: string, finishCallback:any) {
        let self = this; 
        let id = await this.searchId(keyword);
        if (fs.existsSync(this.dir+id+".wav")) {
            this.play(self.dir + id+".wav", finishCallback);
        } else {
            execFile("resources/yt-dlp.exe", ["-x", `${this.ytUrlPrefix+id}`, "-o", this.dir + id], async function (err, data) {
            if (err) {
                console.log(err)
            }
            await self.toWav(self.dir + id+".opus", id).then(() => {
                fs.unlinkSync(self.dir + id+".opus")
                self.play(self.dir + id+".wav", finishCallback);
            });
        });
        }
        
    }

    public searchUrl(keyword: string) {
        let self = this;
        return new Promise<string>((resolve, reject) => {
            execFile("resources/yt-dlp.exe", [`ytsearch:${keyword}`, "--skip-download", "--get-id"], async function (err, data) {
                if (err) console.log(err);
                resolve(self.ytUrlPrefix + data.toString().trim());
            });
        })
    }

    public searchId(keyword: string) {
        return new Promise<string>((resolve, reject) => {
            execFile("resources/yt-dlp.exe", [`ytsearch:${keyword}`, "--skip-download", "--get-id"], async function (err, data) {
                if (err) console.log(err);
                resolve(data.toString().trim());
            });
        })
    }

    public play_pause(){     
        switch (this.playerState) {
            case PlayerState.Idle:
                break;
            case PlayerState.Paused:
                this.resume();
                break;
            case PlayerState.Playing:
                this.pause();
                break;
            default:
                break;
        }
    }

    public async play(path: string, finishCallback:any) {
        this.pause();
        this.playerState = PlayerState.Playing;
        this.currentSongPath = path;
        this.startTime = Date.now()/1000;
        this.currentSongProcess = execFile("resources/ffplay.exe", ["-i", this.currentSongPath, "-autoexit", "-nodisp", "-volume", `${this.volume}`]);
        this.currentSongProcess.on("exit", ()=>{
            this.playerState = PlayerState.Idle;
            finishCallback();
        })
    }

    public pause() {
        if (this.currentSongProcess) {
            this.currentSongProcess.kill();
            this.currentTime = Date.now()/1000 - this.startTime; 
            this.playerState = PlayerState.Paused;
            console.log(`Song stopped at ${new Date(this.currentTime * 1000).toISOString().slice(11, 19)}`);
        }
    }

    public async resume() {
        this.playerState = PlayerState.Playing;
        this.currentSongProcess = execFile("resources/ffplay.exe", ["-ss", new Date(this.currentTime * 1000).toISOString().slice(11, 19), "-i", this.currentSongPath, "-autoexit", "-nodisp"]);
        console.log(`Song resumed at ${new Date(this.currentTime * 1000).toISOString().slice(11, 19)}`);
    }
    

    private async toWav(filepath: string, name:string) {
        return new Promise<void>((resolve, reject) => {
            execFile("resources/ffmpeg.exe", ["-i", filepath, "-vn", "-ar", "44100", "-ac", "2", "-b:a", "192k", this.dir +name+".wav"], (err, data) => {
                if (err) {
                    reject();
                    return;
                }
                resolve();
                return;
            });
        })
    
    }
}
