import { IGlobalKeyDownMap, IGlobalKeyEvent } from "node-global-key-listener";
import { Player } from "./player";
import { KEYS } from "./keys";
import { Keyboard } from ".";

export class ListenerManager {
    
    /**
     * 
     * @param func Function to bind to the listener, should be from this class
     * @param params Extra parameters to add to the function, exceptional to the implicit
     * @param bindStorage Function that stores the binding for later removal
     * @returns binding
     */
    public static CreateBind(func:any, params:any, bindStorage:any){
        let binding = func.bind(params);
        bindStorage(binding);
        return binding;
    }

    
    public static _mainListenerBind : any;
    public static mainListenerBind(bind : any) {
        ListenerManager._mainListenerBind = bind;
    }
    
    public static mainListener(e: IGlobalKeyEvent, down: IGlobalKeyDownMap, player:Player) {
        if (e.rawKey!._nameRaw == KEYS.play_pause && e.state == "UP") {
            player.play_pause();
        }
        if (e.state == "DOWN" && e.name == "A" && down["LEFT CTRL"] && down["F1"]) {
            // AddSong
            Keyboard.removeListener(ListenerManager._mainListenerBind);
        }
    
        if (e.state == "DOWN" && e.name == "E" && down["LEFT CTRL"] && down["F1"]) {
        }
    }


    public static _addSongListenerBind : any;
    public static addSongListenerBind(bind : any) {
        ListenerManager._addSongListenerBind = bind;
    }

    public static addSongListener(e: IGlobalKeyEvent, down: IGlobalKeyDownMap) {
        
    }
}