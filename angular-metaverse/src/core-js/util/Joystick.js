import nipplejs from 'nipplejs';
import * as THREE from 'three';
import { UiElement } from '../UserInterface/UiElement.js';

class Joystick extends UiElement {
    constructor(player){
        super({
            id: "joystick",
            style: {
                pointerEvents: "auto",
                display: "none",
                position: "absolute",
                bottom: "200px",
                left: "20px",
                backgroundColor: "transparent",
                width: "120px",
                height: "120px",
                zIndex: "1",
                touchAction: "manipulation"
            }
        })

        this.player = player;

        this.params = {
            fwdValue : 0,
            bkdValue : 0,
            rgtValue : 0,
            lftValue : 0,
            tempVector : new THREE.Vector3(),
            upVector : new THREE.Vector3(0, 1, 0)
        }

        document.body.appendChild(this.element);
    }

    init() {
        const options = {
            zone: this.element,
            color: "gray",
            size: 120,
            multitouch: true,
            maxNumberOfNipples: 2,
            mode: 'static',
            restJoystick: true,
            shape: 'circle',
            // position: { top: 20, left: 20 },
            position: { top: '60px', left: '60px' },
            dynamicPage: true,
        }
       
       
        this.joyManager = nipplejs.create(options);

        let me = this;
      
        this.joyManager['0'].on('move', function (evt, data) {
            const forward = data.vector.y
            const turn = data.vector.x
            const trigger_run = 0.8;

            me.player.isRunning = forward > trigger_run || forward < -trigger_run || turn > trigger_run || turn < -trigger_run;
            me.player.speedFactor = me.player.isRunning ? 0.005 : 0.002;
            me.player.isSitting = false;
            me.player.extraAnimation = false;

            if (forward > 0) {
                me.params.bkdValue = me.player.speedFactor
                me.params.fwdValue = 0
                
            } else if (forward < 0) {
                me.params.fwdValue = me.player.speedFactor
                me.params.bkdValue = 0
            }
    
            if (turn > 0) {
                me.params.lftValue = me.player.speedFactor
                me.params.rgtValue = 0
            } else if (turn < 0) {
                me.params.lftValue = 0
                me.params.rgtValue = me.player.speedFactor
            }
        })
    
        this.joyManager['0'].on('end', function (evt) {
            me.params.bkdValue = 0
            me.params.fwdValue = 0
            me.params.lftValue = 0
            me.params.rgtValue = 0
            me.player.isRunning = false;
        })
    }

    updatePlayer() {
        // move the player
        const angle = this.player.controls.getAzimuthalAngle();
        this.player.setAnimationParameters("idle");
      
        if (this.params.fwdValue > 0) {
            this.params.tempVector.set(0, 0, -(this.params.fwdValue)).applyAxisAngle(this.params.upVector, angle);
            this.player.position.addScaledVector(this.params.tempVector, 1);
            this.player.horizontalVelocity.add(this.params.tempVector);
            this.player.isRunning ? this.player.setAnimationParameters("run") : this.player.setAnimationParameters("walk");
        }
      
        if (this.params.bkdValue > 0) {
            this.params.tempVector.set(0, 0, this.params.bkdValue).applyAxisAngle(this.params.upVector, angle);
            this.player.position.addScaledVector(this.params.tempVector, 1);
            this.player.horizontalVelocity.add(this.params.tempVector);
            this.player.isRunning ? this.player.setAnimationParameters("run") : this.player.setAnimationParameters("walk");
        }
      
        if (this.params.lftValue > 0) {
            this.params.tempVector.set(-(this.params.lftValue), 0, 0).applyAxisAngle(this.params.upVector, angle);
            this.player.position.addScaledVector(this.params.tempVector, 1);
            this.player.horizontalVelocity.add(this.params.tempVector);
            this.player.isRunning ? this.player.setAnimationParameters("run") : this.player.setAnimationParameters("walk");
        }
      
        if (this.params.rgtValue > 0) {
            this.params.tempVector.set(this.params.rgtValue, 0, 0).applyAxisAngle(this.params.upVector, angle);
            this.player.position.addScaledVector(this.params.tempVector, 1);
            this.player.horizontalVelocity.add(this.params.tempVector);
            this.player.isRunning ? this.player.setAnimationParameters("run") : this.player.setAnimationParameters("walk");
        }
 
        // reposition camera
        this.player.camera.position.sub(this.player.controls.target);
        this.player.controls.target.copy(this.player.position);
        this.player.camera.position.add(this.player.position);
    }

}

export { Joystick };