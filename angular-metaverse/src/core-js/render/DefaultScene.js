import { Scene, Color, Fog, HemisphereLight, PointLight, PointLightHelper } from 'three';
import { DefaultDirectionalLight } from "./DefaultDirectionalLight.js"

export class DefaultScene extends Scene {
    constructor() {
        super();
        
        // ===== sky =====
        // TODO skybox
        this.background = new Color(0x69e6f4);
        this.fog = new Fog( new Color(0.8, 0.8, 0.8), 10, 150 );

        // ===== ambient lights =====
        const light = new HemisphereLight(0xffeeff, 0x777788, 1);
        this.add(light);

        // ===== shadowLights =====
        this.shadowLight = new DefaultDirectionalLight();
        this.add(this.shadowLight);
        this.add(this.shadowLight.target);

        this.pointLights = [];
        // this.addLight(10, 15, 10);
        // this.addLight(20, 15, 20);

        this.interactives = [];
    }

    addLight(x, y, z) {
        // ==== pointLights ====
        const pointLight = new PointLight(0xeeeeee, 2, 500);
        pointLight.castShadow = true;
        pointLight.position.set(x, y, z);
        this.add(pointLight);

        //uncomment to display light position
        const pointLightHelper = new PointLightHelper(pointLight);
        this.add(pointLightHelper);

        this.pointLights.push(pointLight);
    }

    toggleLights() {
        this.pointLights.forEach(light => {
            light.visible = !light.visible;
        })
    }

    toggleShadows() {
        this.shadowLight.castShadow = !this.shadowLight.castShadow;
    }

    toggleInteractiveDebugBox() {
        this.interactives.forEach(interactive => {
            interactive.toggleDebugBox();
        })
    }

    buildInteractives() {
        this.children.forEach(child => {
            if(child.name === "Scene") {
                child.children.forEach(mesh => {
                    if(mesh.name.substring(0,5) === "_stm_") {
                        const type = mesh.name.substring(5).substring(0,mesh.name.substring(5).indexOf('_'));

                        switch (type) {

                            case "spawnPoint": {
                                LOCAL_PLAYER.spawnPoint = mesh.position;
                                LOCAL_PLAYER.position.copy(mesh.position);
                            } break;
                        }
                    }
                })
            }
        })
    }

    update() {

        this.shadowLight.update();

        this.interactives.forEach(interactive => {
            interactive.update();
        })
    }
}
