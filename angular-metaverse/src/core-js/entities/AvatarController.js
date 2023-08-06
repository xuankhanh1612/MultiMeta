import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { NameTooltip } from '../UserInterface/Common/NameTooltip.js';
import { loadingBar } from '../UserInterface/Common/loadingPage.js';

const DEFAULT_AVATAR_PATH = '//asset.airclass.io/public/avatars/rpm-male/male-0.glb';
const DEFAULT_ANIMATIONS = [
    {name: "idle", url: '//asset.airclass.io/public/animations/rpm/Idle.fbx'},
    {name: "walk", url: '//asset.airclass.io/public/animations/rpm/Walking.fbx'},
    {name: "run", url: '//asset.airclass.io/public/animations/rpm/Running.fbx'},
    {name: "jump", url: '//asset.airclass.io/public/animations/rpm/Jump.fbx'},
    {name: "standsit", url: '//asset.airclass.io/public/animations/rpm/StandToSit.fbx'},
    {name: "sitidle", url: '//asset.airclass.io/public/animations/rpm/SitIdle.fbx'},
    {name: "sitclap", url: '//asset.airclass.io/public/animations/rpm/SitClap.fbx'},
    {name: "sitpoint", url: '//asset.airclass.io/public/animations/rpm/SitPoint.fbx'},
    {name: "standclap", url: '//asset.airclass.io/public/animations/rpm/StandClap.fbx'},
    {name: "standpoint", url: '//asset.airclass.io/public/animations/rpm/StandPoint.fbx'}
]
const DEFAULT_SIZE = 1;

class AvatarController extends THREE.Object3D {
    constructor(manager, name) {//animationURL, avatarURL, keyMap
        super();
        this.loader = new GLTFLoader(manager);
        this.FBXLoader = new FBXLoader(manager);
        this.manager = manager;
        this.quaternion90deg = new THREE.Quaternion();
        this.quaternion90deg.setFromAxisAngle( new THREE.Vector3( -1, 0, 0 ), -Math.PI / 2 );
        this.peerName = name;
        this.showLoading = true;
    }

    spawnAvatar() {
        console.log("Spawning Avatar...");
        if(this.showLoading) loadingBar(this.manager);
        this.params.avatarPath = typeof this.params.avatarPath === "undefined" ? DEFAULT_AVATAR_PATH : this.params.avatarPath;
        this.params.animationMapping = DEFAULT_ANIMATIONS;
        this.params.size = typeof this.params.size === "undefined" ? DEFAULT_SIZE : this.params.size;
        this.loadAvatar(this.params.avatarPath, () => this.loadAnimations(this.params.animationMapping));
    }

    spawnRemoteAvatar(params) {
        this.params = params;
        let name = this.params.otherPlayer ? this.params.otherPlayer : 'guest'
        this.peerName = name;
        this.showLoading = false;
        this.spawnAvatar();
    }

    play(anim, time = 0.5) {
        let action = this.animations.find(animation => animation.name == anim);
        if (this.current && action && action.anim != this.current) {
            this.current.fadeOut(time);
            action.anim.reset();
            action.anim.setEffectiveWeight( 1 );
            action.anim.play();
            action.anim.fadeIn(time);
            this.current = action.anim;
        }
    }

    update(delta, position, horizontalVelocity, anim, time = 0.5) {
       // use the mixer as only signal that everything is properly loaded
       if(this.mixer){
            this.position.copy(position);
            this.updateFacingDirection(horizontalVelocity);
            this.play(anim, time);
            this.mixer.update(delta);
        } 
    }
 

    setTransparency(setTo) {
        if(setTo) {
            window.MAIN_SCENE.remove(this.model);
            
        } else {
            window.MAIN_SCENE.add(this.model);
        }
        this.isVisible = !setTo;
    }
    

    changeAvatar(avatarUrl) {
        loadingBar(this.manager);
        this.model.remove(this.username);
        this.peerName = 'guest';
        this.loadAvatar(avatarUrl, () => this.loadAnimations());
    }

    reloadAvatar() {
        if(this.showLoading) loadingBar(this.manager, true);
        this.model.remove(this.username);
        this.loadAvatar(this.params.avatarPath, () => this.loadAnimations(this.params.animationMapping));
    }

    loadAvatar(avatarURL, loadAnimation) {
        this.loader.load(avatarURL, (responseObject) => {
            MAIN_SCENE.remove(this.model)

            this.radius = 0.25;
            this.size = 1.5;

            this.model = responseObject.scene;
            this.model.scale.set(this.params.size, this.params.size, this.params.size);
            this.model.traverse(child => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.frustumCulled = false;
                }
            });

            const tooltip = new NameTooltip(this.peerName);
            this.username = new CSS2DObject( tooltip.element );
            this.username.position.set( this.model.position.x,  this.model.position.y + 2, this.model.position.z);
            this.model.add( this.username );
            this.mixer = new THREE.AnimationMixer(this.model);
            this.animations = [];
            MAIN_SCENE.add(this.model);
            loadAnimation(); 
        });
    }

    removeAvatar(){
        this.model.remove(this.username);
        MAIN_SCENE.remove(this.model);
    }

    loadAnimations(animationMapping) {
        var _this = this;
        animationMapping.forEach(animation => {
            this.FBXLoader.load(animation.url, (obj) => {
                let action = {name: animation.name, anim: _this.mixer.clipAction(obj.animations[0])};
                _this.animations.push(action);
                if(action.name == "idle") {
                    _this.current = action.anim;
                    _this.current.play();
                }
            });
        });
        MAIN_SCENE.add(this.model);
        console.log("End Spawning Avatar...");
    }

    updateFacingDirection(horizontalVelocity) {
        if(horizontalVelocity.length() > 0.001){
            this.lookAt(this.position.x + horizontalVelocity.x, this.position.y + this.size/2 + this.radius , this.position.z + horizontalVelocity.z);
            this.quaternion.multiply(this.quaternion90deg);
        }

        this.model.position.copy(this.position);
        this.model.position.y -= this.size;
        this.model.quaternion.copy(this.quaternion);
    }

}

export { AvatarController };