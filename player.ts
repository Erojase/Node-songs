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

    public searchAndPlay(keyword: string, finishCallback:any) {
        let self = this;
        let name = keyword.replaceAll(" ","_");        
        fs.rmSync(this.dir, { recursive: true });
        fs.mkdirSync(this.dir);
        execFile("resources/yt-dlp.exe", ["-x", `ytsearch:${keyword}`, "-o", this.dir + name], async function (err, data) {
            console.log(err)
            await self.toWav(self.dir + name+".opus", name).then(() => {
                fs.unlinkSync(self.dir + name+".opus")
                self.play(self.dir + name+".wav", finishCallback);
            });
        });
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
        this.playerState = PlayerState.Playing;
        this.currentSongPath = path;
        this.startTime = Date.now()/1000;
        this.currentSongProcess = execFile("resources/ffplay.exe", ["-i", this.currentSongPath, "-autoexit", "-nodisp"]);
        this.currentSongProcess.on("exit", ()=>{
            this.playerState = PlayerState.Idle;
            finishCallback();
        })
    }

    public pause() {
        if (this.currentSongProcess) {
            this.currentTime = Date.now()/1000 - this.startTime; 
            this.currentSongProcess.kill();
            if(this.currentSongProcess.killed) {
                setTimeout(()=>{this.playerState = PlayerState.Paused;}, 50);
            }
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
