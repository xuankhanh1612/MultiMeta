export class SessionService {
    virtualEnvironment;
    constructor() {
        this.ANIMATIONS = [ "sit", "clap", "hand-pointing", "jump"];
        this.metaVerseByDomain = {};
        this.userinfo = {};
        this.isLoadingGlobal = false;
        this.progressLoaded = 0;
        this.metavers = [];
        this.balance = 0;
        this.messages = []
    }

    animationPlayer(action) {
        LOCAL_PLAYER.isSitting = action == 'sit' || LOCAL_PLAYER.isSitting;

        if(LOCAL_PLAYER.isSitting) {
            if(action == 'sit')  LOCAL_PLAYER.triggerExtraAnimation("standsit");
            if(action == 'clap') LOCAL_PLAYER.triggerExtraAnimation("sitclap");
            if(action == 'hand-pointing') LOCAL_PLAYER.triggerExtraAnimation("sitpoint");
        } else {
            if(action == 'clap') LOCAL_PLAYER.triggerExtraAnimation("standclap");
            if(action == 'hand-pointing') LOCAL_PLAYER.triggerExtraAnimation("standpoint");
            if(action == 'jump') LOCAL_PLAYER.triggerExtraAnimation("jump");
        }
    }

    cleardata() {
        localStorage.clear()
        this.metaVerseByDomain = {};
        this.userinfo = {};
        this.virtualEnvironment.disconnect();
    }

    detectMob() {
        const toMatch = [
            /Android/i,
            /webOS/i,
            /iPhone/i,
            /iPad/i,
            /iPod/i,
            /BlackBerry/i,
            /Windows Phone/i
        ];
        
        return toMatch.some((toMatchItem) => {
            return navigator.userAgent.match(toMatchItem);
        });
    }
}
