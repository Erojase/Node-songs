import path from "path";
import fs from 'fs';
import { Player} from './player.ts';

export interface IPlaylist{
    name: string;
    songs: ISong[]
}

export interface ISong{
    name: string,
    link: string | undefined
}


export class Playlist {

    private readonly _defaultPlaylistPath : string = path.resolve("./playlists");

    private player: Player;

    constructor() {
        if (!fs.existsSync(this._defaultPlaylistPath)) {
            fs.mkdirSync(this._defaultPlaylistPath);
        }
        this.player = new Player();
    }

    public CreatePlaylist(name:string): void {
        let playlist: IPlaylist = {
            name: name,
            songs: []
        }

        fs.writeFileSync(this._defaultPlaylistPath+"/"+name+".json", JSON.stringify(playlist));
    }

    public ListPlaylists(): string[]{
        let playlists = fs.readdirSync(this._defaultPlaylistPath);
        return playlists.map((filename, index) => index + " - "+filename.split(".")[0]);
    }

    public async AddSong(playlistName: string, song:string) {
        console.log("Adding song "+song);
        if (!fs.existsSync(this._defaultPlaylistPath+"/"+playlistName+".json")) {
            this.CreatePlaylist(playlistName.toString());
        }
        let list:IPlaylist = JSON.parse(fs.readFileSync(this._defaultPlaylistPath+"/"+playlistName+".json", { encoding: "utf-8"}));
        let url = await this.player.searchUrl(song);
        list.songs.push({
            name: song,
            link: url
        });
        fs.writeFileSync(this._defaultPlaylistPath+"/"+playlistName+".json", JSON.stringify(list));
        return true;
    }

    public PlayPlaylist(playlistName: string){
        
    }


}