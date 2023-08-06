/******* Photon Engine Demo for Javascript ********/

import { AvatarController } from "../entities/AvatarController";
import { Vector3 } from 'three';

//my server
// var AppId = "250f4e9e-9542-4892-9865-336d1c752d1f";
//other's server
// var AppId = "6c9ca915-4db7-450c-9a65-2035737850e1";
// var AppVersion = "1.0";
// var IP = "103.195.236.105";

var AppId = "Game";
var IP = "bdsg.multimeta.one";
var MasterServer = IP + ":19090";
var NameServer = "ws://" + IP + ":9093";

var WSS = true;
var REGION = 'ASIA';
var CHAT = 0, MOVEMENT = 2, PLAYER_JOIN = 1, CHARACTER_CHANGE = 3;
var ROOMS = ['DEMO-WEB-MAIN', 'DEMO-WEB-WAIT'];
var MAX_PLAYERS = 100;

const LBC = (function (_super) {

    __extends(LBC, _super);

    function LBC() {
        var _this = _super.call(this, WSS ? Photon.ConnectionProtocol.Wss : Photon.ConnectionProtocol.Ws, AppId, null) || this;
        // this.RATE = VIRTUAL_ENVIRONMENT.delta * 2000;
        this.RATE = 30;
        if(VIRTUAL_ENVIRONMENT.sessionService) {
            this.myUserInfo = VIRTUAL_ENVIRONMENT.sessionService.userinfo;
            this.meta = VIRTUAL_ENVIRONMENT.sessionService.metaVerseByDomain.id + "-" + VIRTUAL_ENVIRONMENT.sessionService.metaVerseByDomain.name;
            this.myAvatar = VIRTUAL_ENVIRONMENT.sessionService.metaVerseByDomain.meta_setting.my_avatar;
        }
        this.ROOMS = this.meta ? [ROOMS[0] + "-" + this.meta, ROOMS[1] + "-"  + this.meta] : ROOMS;
        this.avatarControllers = {};
        this.start();
        return _this;
    }

    LBC.prototype.start = function() {
        this.setMasterServerAddress(MasterServer);
        this.connect();
        // this.connectToRegionMaster(REGION);
        // this.setNameServerAddress(NameServer);
        // this.connectToNameServer();
        // this.getRegions();
    }

    LBC.prototype.onRoomListUpdate = function (rooms, roomsUpdated, roomsAdded, roomsRemoved) {
        console.log(`Demo: onRoomListUpdate ${rooms} ${roomsUpdated} ${roomsAdded} ${roomsRemoved}`);
    };

    LBC.prototype.onRoomList = function (rooms) {
        let hasRoomMain = false;

        rooms.forEach(r => {
            let roomName = r.name;
            if(roomName == this.ROOMS[0]) hasRoomMain = true;
        })

        if(this.isInLobby()) {
            if(!hasRoomMain)
                this.createRoom(this.ROOMS[0], {isVisible: true, maxPlayers: MAX_PLAYERS});
            this.joinRoom(this.ROOMS[0]);
        }
    };

    LBC.prototype.off = function () {
        this.disconnect();
    };

    LBC.prototype.onStateChange = function (state) {
        // "namespace" import for static members shorter acceess
        var LBC = Photon.LoadBalancing.LoadBalancingClient;
        this.status = LBC.StateToName(state);
    };

    LBC.prototype.objToStr = function (x) {
        var res = "";
        for (var i in x) {
            res += (res == "" ? "" : " ,") + i + "=" + x[i];
        }
        return res;
    };

    LBC.prototype.setup = function () {
        if (this.isInLobby()) {
            LOCAL_PLAYER.avatarController.reloadAvatar();
        }
    };

    LBC.prototype.onError = function (errorCode, errorMsg) {
        console.log("Error " + errorCode + ": " + errorMsg);
    };

    LBC.prototype.actorsCount = function () {
        let myRoomActorsCount = this.myRoomActorCount();
        return myRoomActorsCount;
    };

    LBC.prototype.onEvent = function (code, message, actorNr) {
        var sender = message.user;
        switch (code) {
            case CHAT:
                if (actorNr)
                    VIRTUAL_ENVIRONMENT.incommingMsg({user: sender, content: message.content, avatar: message.avatar});
                break;
            case MOVEMENT: 
                if (actorNr) {// update others movement
                    let avatarController = this.avatarControllers[actorNr];
                    if (avatarController) {
                        let position = new Vector3(message.movement.position.x, message.movement.position.y, message.movement.position.z);
                        let horizontalVelocity =  new Vector3(message.movement.horizontalVelocity.x, 0, message.movement.horizontalVelocity.z);
                        avatarController.update(VIRTUAL_ENVIRONMENT.delta, position, horizontalVelocity, message.movement.action, message.movement.animationTime);
                    }
                }
                break;
            case PLAYER_JOIN:
                if (actorNr) {// spawn other joins to me
                    let avatarController = new AvatarController(VIRTUAL_ENVIRONMENT.loadingManager);
                    avatarController.spawnRemoteAvatar({avatarPath: message.avatarPath, otherPlayer: sender ? sender : "Guest-" + actorNr});
                    this.avatarControllers[actorNr] = avatarController; 
                }
                break;
            
            case CHARACTER_CHANGE:
                if(actorNr) {
                    let avatarController = this.avatarControllers[actorNr];
                    if (avatarController) {
                        avatarController.showLoading = false;
                        avatarController.params.avatarPath = message.characterPath;
                        avatarController.reloadAvatar();
                    }
                }
            
            default:
        }
    };

    LBC.prototype.onActorJoin = function (actor) {
        console.log("actor " + actor.actorNr + " joined");
        let toActorNrs = [];
        if(this.myActor().actorNr !== actor.actorNr) {// others join
            //also trigger my join to new user joined
            toActorNrs.push(actor.actorNr);  
        } else { // my join
            //also trigger my join to others
            for (var nr in this.myRoomActors()) {
                if(nr != this.myActor().actorNr) {
                    toActorNrs.push(parseInt(nr));
                }
            } 
            let myName = this.myUserInfo.first_name ? this.myUserInfo.first_name + " " + this.myUserInfo.last_name : "Guest-" + actor.actorNr;
            this.myActor().name = myName;
            LOCAL_PLAYER.avatarController.peerName = myName;
            LOCAL_PLAYER.avatarController.spawnAvatar();
        }

        if(toActorNrs.length > 0) {
            this.notifyMyJoin(toActorNrs);
            setTimeout(() => this.syncMyMovement(toActorNrs), 5000);
            
        }
    };

    LBC.prototype.onActorPropertiesChange = function (actor) {
        console.log("Actor changes properties");
    };

    LBC.prototype.onMyRoomPropertiesChange = function () {
        console.log("My Room changes properties");
    };

    LBC.prototype.onJoinRoom = function () {
        console.log("Game " + this.myRoom().name + " joined");
    };

    LBC.prototype.onActorLeave = function (actor) {
        console.log("actor " + actor.actorNr + " left");
        let avatarController = this.avatarControllers[actor.actorNr];
        if (avatarController && !actor.isLocal) {
            avatarController.removeAvatar();
        } 

        if (avatarController && actor.isLocal) {
            avatarController.reloadAvatar();
        }

        delete this.avatarControllers[actor.actorNr];
    };

    LBC.prototype.disconnect = function() {
        this.leaveRoom();
    }

    LBC.prototype.syncMyMovement = function (toActorNrs) {
        let __this = this;
        setInterval(function () {
            try {
                let myMove = {position: LOCAL_PLAYER.position, horizontalVelocity: LOCAL_PLAYER.horizontalVelocity, action: LOCAL_PLAYER.currentAnimation, animationTime: LOCAL_PLAYER.currentAnimationTime};
                __this.raiseEvent(MOVEMENT, { movement: myMove }, {targetActors: toActorNrs});
            }
            catch (err) {
                console.log("error: " + err.message);
            }
        }, this.RATE);
        
    };

    LBC.prototype.notifyMyJoin = function (toActorNrs) {
        this.raiseEvent(PLAYER_JOIN, { avatarPath: this.myAvatar.avatar_path, user: this.myActor().name }, {targetActors: toActorNrs});
    };

    LBC.prototype.sendMessage = function (message) {
        try {
            this.raiseEvent(CHAT, message);
        }
        catch (err) {
            console.log("error: " + err.message);
        }
    };

    LBC.prototype.changeCharacter = function(characterPath) {
        try {
            this.raiseEvent(CHARACTER_CHANGE, {characterPath: characterPath});
        }
        catch (err) {
            console.log("error: " + err.message);
        }
    }

    return LBC;

})(Photon.LoadBalancing.LoadBalancingClient);

class PhotonController {
    constructor(){
        this.engine = new LBC();
    }

    sendMessage(msg) {
        this.engine.sendMessage(msg);
    }

    actorCounts() {
        return this.engine.actorsCount();
    }

    changeCharacter(characterPath) {
        this.engine.changeCharacter(characterPath);
    }

    disconnect() {
        this.engine.disconnect();
    }
}

export { PhotonController };