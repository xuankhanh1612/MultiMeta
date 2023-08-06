import { CapsuleEntity } from "./CapsuleEntity.js";
import { OrbitControls } from "../util/OrbitControls.js";
import { Vector3, Vector4 } from 'three';
import { AvatarController } from './AvatarController.js';
import { AlertBox } from "../UserInterface/Common/AlertBox.js";
import { Joystick } from "../util/Joystick.js";

class PlayerLocal extends CapsuleEntity {
    constructor(params, camera, loadingManager) {
        super(0.25, 1.5);
        this.spawnPoint = typeof params.spawn === "undefined" ? {x: 0, y:0, z:0} : params.spawn;
        this.position.x = this.spawnPoint.x;
        this.position.y = this.spawnPoint.y;
        this.position.z = this.spawnPoint.z;


        this.camera = camera;
        this.fpsControls = new Vector4(0.01, Math.PI - 0.01, 0.01, 1);
        this.thirdPersonControls = new Vector4(Math.PI / 3, Math.PI / 2 - 0.01, 5, 0.2);
        this.controlVector = this.thirdPersonControls.clone();
        this.targetControlVector = this.thirdPersonControls;
        this.horizontalVelocity = new Vector3();
        this.playerDirection = new Vector3();
        this.positionChange = new Vector3();
        this.keys = {};

        this.visible = false;
        this.isRunning = false;
        this.isSitting = false;
        this.extraAnimation = false;

        this.avatarController = new AvatarController(loadingManager);
        this.avatarController.params = params;
        this.characterBox();
        this.setupControls();
    }

    setupControls() {
        this.controls = new OrbitControls(this.camera, VIRTUAL_ENVIRONMENT.labelRenderer.domElement);
        this.controls.minPolarAngle = 0.01; 
        this.controls.maxPolarAngle = Math.PI - 0.25;
        this.controls.target.set( this.camera.position.x + 1, this.camera.position.y, this.camera.position.z );
        this.controls.update();

        if(VIRTUAL_ENVIRONMENT.touch) {
            this.speedFactor = 0.05;
            this.joystick = new Joystick(this);
            this.joystick.element.style.display = 'block';
            this.joystick.init();

        }else {
            this.speedFactor = 0.05;
            if(this.joystick) this.joystick.element.remove();
            this.setupKeyControls();
        }
        
    }

    setupKeyControls() {
        document.addEventListener('keyup', (event) => {
            delete this.keys[event.key.toLowerCase()];
        });
        document.addEventListener('keydown', (event) => {
            if (event.target.tagName.toUpperCase() == 'INPUT') return;
            
            if (event.keyCode === 32 && event.target === PARENT_VIEW) {
                event.preventDefault();
            }

            if (event.key === "v") {
                if (this.targetControlVector === this.thirdPersonControls) {
                    this.targetControlVector = this.fpsControls;
                    this.avatarController.setTransparency(true);
                } else {
                    this.targetControlVector = this.thirdPersonControls;
                    this.avatarController.setTransparency(false);
                }
            }
            if (event.key === "r") {
                this.position.set(this.spawnPoint.x, this.spawnPoint.y, this.spawnPoint.z);
                this.velocity = new Vector3();
            }

            this.keys[event.key.toLowerCase()] = true;
        });

        this.controls.addEventListener('unlock', () => {
            VIRTUAL_ENVIRONMENT.UI_CONTROLLER.handleControlsUnlock()
        });
    }
    
    getForwardVector() {
        this.camera.getWorldDirection(this.playerDirection);
        this.playerDirection.y = 0;
        this.playerDirection.normalize();
        this.playerDirection.multiplyScalar(-1);
        return this.playerDirection;
    }

    getSideVector() {
        this.camera.getWorldDirection(this.playerDirection);
        this.playerDirection.y = 0;
        this.playerDirection.normalize();
        this.playerDirection.cross(this.camera.up);
        this.playerDirection.multiplyScalar(-1);
        return this.playerDirection;
    }

    update(delta, collider) {
        if(VIRTUAL_ENVIRONMENT.touch) {
            this.updateTouchControl(delta, collider);
        }else {
            this.updateKeyControl(delta, collider);
        }
    }

    updateTouchControl(delta, collider) {
        if(!this.avatarController.model) return;
        this.controls.update();

        for(let i=0; i<5; i++){
            super.update(delta/5, collider);
        }

        if (this.position.y < -1000) {
            this.position.set(this.spawnPoint.x, this.spawnPoint.y, this.spawnPoint.z);
            this.velocity = new Vector3();
        }

        this.updateCurrentAnimationForTouch();

        if(typeof this.avatarController !== "undefined"){
            this.avatarController.update(delta, this.position, this.horizontalVelocity, this.currentAnimation, this.currentAnimationTime);
            this.avatarController.opacity = (this.controlVector.z - 0.01) / (40 - 0.01);
        }
    }

    updateKeyControl(delta, collider) {

        if(Object.keys(this.keys).length > 0){
            // speedFactor depending on the run/walk state

            this.isRunning = this.keys["shift"];

            this.speedFactor = this.isRunning ? 0.15 : 0.05;

            if (this.keys["w"]) {
                this.horizontalVelocity.add(this.getForwardVector(this.camera).multiplyScalar(this.speedFactor * delta));
            }

            if (this.keys["s"]) {
                this.horizontalVelocity.add(this.getForwardVector(this.camera).multiplyScalar(-this.speedFactor * delta));
            }

            if (this.keys["a"]) {
                this.horizontalVelocity.add(this.getSideVector(this.camera).multiplyScalar(-this.speedFactor * delta));
            }

            if (this.keys["d"]) {
                this.horizontalVelocity.add(this.getSideVector(this.camera).multiplyScalar(this.speedFactor * delta));
            }
            if (this.keys[" "]) {
                this.velocity.y = 3.0;
                this.setAnimationParameters("jump", 0.5);
            }
        } else {
            this.isRunning = false;
            this.horizontalVelocity.multiplyScalar(0);
        }


        for(let i=0; i<5; i++){
            super.update(delta/5, collider);
        }


        if (this.position.y < -20) {
            this.position.set(this.spawnPoint.x, this.spawnPoint.y, this.spawnPoint.z);
            this.velocity = new Vector3();
        }

        this.updateCurrentAnimation();

        if(typeof this.avatarController !== "undefined"){
            this.avatarController.update(delta, this.position, this.horizontalVelocity, this.currentAnimation, this.currentAnimationTime);
        }

        this.controlVector.lerp(this.targetControlVector, 0.1);
    }

    updateCurrentAnimation() {
        if (this.lastPosition) {
            this.positionChange.multiplyScalar(0.8);
            this.positionChange.addScaledVector(this.position.clone().sub(this.lastPosition), 0.2);
        }
        this.lastPosition = this.position.clone();
        
        if(this.onGround) {
            if (this.keys["w"] || this.keys["s"] || this.keys["a"] || this.keys["d"]) {
                this.isSitting = false;
                this.extraAnimation = false;
                if(this.keys["shift"]){ 
                    this.setAnimationParameters("run"); 
                } else { 
                    this.setAnimationParameters("walk"); 
                }
            
            } else if(this.extraAnimation) {
                if(this.isSitting) {
                    if(this.shouldChangeAnimationAfter(1.5)) {
                        this.setAnimationParameters("sitidle");
                        this.currentTimer = Date.now();  
                    }
                }
                if(this.shouldChangeAnimationAfter(2)) {
                    this.extraAnimation = false;
                }
            } else {
                this.setAnimationParameters("idle"); 
            }
        } else {
            if(this.positionChange.y < -3) {
                this.setAnimationParameters("fall", 0.25);
            }
        }
    }

    setAnimationParameters(anim, time = 0.5) {
        this.currentAnimation = anim;
        this.currentAnimationTime = time;
        this.currentTimer = Date.now();
    }

    triggerExtraAnimation(anim) {
        this.setAnimationParameters(anim)
        this.extraAnimation = true;
    }

    shouldChangeAnimationAfter(time) {
        var deltaAnimation = (Date.now() - this.currentTimer)/1000;
        return deltaAnimation > time;
    }

    updateCurrentAnimationForTouch() {
        if(this.onGround) {
            if(this.extraAnimation) {
                if(this.isSitting) {
                    if(this.shouldChangeAnimationAfter(2)) {
                        this.setAnimationParameters("sitidle");
                        this.currentTimer = Date.now();  
                    }
                }
                if(this.shouldChangeAnimationAfter(2)) {
                    this.extraAnimation = false;
                }
            } else {
                this.joystick.updatePlayer();
            }
        } else {
            if(this.positionChange.y < -3) {
                this.setAnimationParameters("fall", 0.25);
            }
        }
        
    }

    // =============================== READY PLAYER ME ============================== //

    characterBox() {
        let iframe = document.createElement('iframe');
        iframe.id = 'frame';
        iframe.className = 'frame';
        const subdomain = 'demo'; // Replace with your custom subdomain
        iframe.src = `https://${subdomain}.readyplayer.me/avatar?frameApi&clearCache`;
        iframe.allow = "camera *; clipboard-write";

        Object.assign(iframe.style, {
            width: '100%',
            height: '900px',
            padding: '10px',
        });

        this.content = document.createElement('div');
        this.content.appendChild(iframe);
    }

    changeCharacter() {
        window.addEventListener('message', (e) => {
            const json = this.parse(e);
            if (json?.source !== 'readyplayerme') {
                return;
            }
            this.subscribe(json);
        });
        document.addEventListener('message', (e) => {
            const json = this.parse(e);
            if (json?.source !== 'readyplayerme') {
                return;
            }
            this.subscribe(json);
        });
        new AlertBox(null, this.content, null, {title: "CANCEL", icon: ""}, null);
    }

    subscribe(json) {
        // Susbribe to all events sent from Ready Player Me once frame is ready
        if (json.eventName === 'v1.frame.ready') {
          frame.contentWindow.postMessage(
            JSON.stringify({
              target: 'readyplayerme',
              type: 'subscribe',
              eventName: 'v1.**'
            }),
            '*'
          );
        }

        // Get avatar GLB URL
        if (json.eventName === 'v1.avatar.exported') {
            this.avatarController.params.avatarPath = json.data.url;
            this.avatarController.reloadAvatar();
            VIRTUAL_ENVIRONMENT.photonController.changeCharacter(json.data.url);
            let alertBox = document.getElementById('AlertBox');
            if(alertBox) {
                this.content.remove();                
                alertBox.remove();
            }
        }

        // Get user id
        if (json.eventName === 'v1.user.set') {
          console.log(`User with id ${json.data.id} set: ${JSON.stringify(json)}`);
        }
      }

      parse(event) {
        try {
          return JSON.parse(event.data);
        } catch (error) {
          return null;
        }
      }
}

export { PlayerLocal }