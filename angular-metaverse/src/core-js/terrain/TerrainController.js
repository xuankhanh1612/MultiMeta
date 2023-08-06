import { Object3D, Scene, Mesh, Vector3, MeshBasicMaterial } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { TextureLoader } from 'three/src/loaders/TextureLoader.js';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { MeshBVH } from '../util/three-mesh-bvh.js';
import { NameTooltip } from '../UserInterface/Common/NameTooltip.js';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { logoCTys, tabs } from '../UserInterface/Common/MapItem.js';
import { UiElement } from '../UserInterface/UiElement.js';
import { AlertBox } from '../UserInterface/Common/AlertBox.js';
import { IconToolTip } from '../UserInterface/Common/IconTooltip.js';
import { UiTab } from '../UserInterface/Common/UiTab.js';

class TerrainController {
    
    constructor(manager, myTerrain){
        this.FBXLoader = new FBXLoader(manager);
        this.GLTFLoader = new GLTFLoader(manager);
        this.TextureLoader = new TextureLoader();
        this.terrain = new Object3D();
        this.myTerrain = myTerrain;
        this.collider;
        this.bloomScene = new Scene();
        this.geometries = [];
        this.terrains = [];
    }

    reloadTerrain(URL, scene, scale) {
        MAIN_SCENE.remove(this.terrain);
        let format = URL.substring(URL.length - 3);
        this.loadTerrain(URL, scene, 0, 0, 0, format, scale)
        LOCAL_PLAYER.avatarController.reloadAvatar();
    }

    loadTerrain(URL, scene, x, y, z, format, scaleFactor){
        switch (format) {
            case "fbx":
                this.FBXLoader.load(URL, (responseObject) => {
                    this.handleLoadedTerrain(responseObject, scene, x, y, z, scaleFactor);
                })
                break;
        
            case "glb":
                this.GLTFLoader.load(URL, (responseObject) => {
                    this.handleLoadedTerrain(responseObject.scene, scene, x, y, z, scaleFactor);
                })
                break;
        }
    }

    handleLoadedTerrain(terrain, scene, x, y, z, scaleFactor) {
        this.terrain = terrain;
        this.terrain.position.set(x, y, z);
        this.terrain.scale.set(scaleFactor, scaleFactor, scaleFactor)
        this.terrain.traverse(object => {
            if (object.isMesh) {
                object.castShadow = true;
                object.receiveShadow = true;
                object.material.roughness = 1;
                if (object.material.map) {
                    object.material.map.anisotropy = 16;
                    object.material.map.needsUpdate = true;
                }
                const cloned = new Mesh(object.geometry, object.material);
                object.getWorldPosition(cloned.position);
                if (object.material.emissive && (object.material.emissive.r > 0 || object.material.emissive.g > 0 || object.material.color.b > 0)) {
                    this.bloomScene.attach(cloned);
                }
            }
            if (object.isLight) {
                object.parent.remove(object);
            }

        });

        // =============================== BDSG ==========================
        
        if(this.myTerrain) {
            let subTerrains = this.myTerrain.sub_terrains;
            if(subTerrains) {
                Promise.all(subTerrains.map(async (item) => {
                    this.loadSubTerrain(item, MAIN_SCENE, scaleFactor);
                }));
            }
        }

        // ==================================================================

        scene.add(this.terrain);
        this.generateCollider(this.terrain, scene);
        scene.buildInteractives();
    }

    addTooltip(checkpoint, name) {
        let tooltip = new NameTooltip(name);
        const labelName = new CSS2DObject( tooltip.element );
        labelName.position.set(0, 0, 0);
        checkpoint.add( labelName );
    }

    generateCollider(model, scene){
        model.traverse(object => {
            if (object.geometry && object.visible) {
                const cloned = object.geometry.clone();
                cloned.applyMatrix4(object.matrixWorld);
                for (const key in cloned.attributes) {
                    if (key !== 'position') { cloned.deleteAttribute(key); }
                }
                this.geometries.push(cloned);
            }
        });
        const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(this.geometries, false);
        mergedGeometry.boundsTree = new MeshBVH(mergedGeometry, { lazyGeneration: false });
        this.collider = new Mesh(mergedGeometry);
        this.collider.bvh = mergedGeometry.boundsTree;
        this.collider.material.wireframe = true;
        this.collider.material.opacity = 0.5;
        this.collider.material.transparent = true;
        this.collider.visible = false; // toggle this value to see the collider
        scene.add(this.collider);

        /* The following lines of code are used to debug the BVH collider. 
         * Uncomment these lines to visualize the BVH collider. 
         * More information on Bounding Volume Hierarchy (BVH):
         * https://en.wikipedia.org/wiki/Bounding_volume_hierarchy
        */
       
        // const visualizer = new MeshBVHVisualizer(this.collider, 10);
        // visualizer.visible = true;
        // visualizer.update();
        // scene.add(visualizer);
    }

    // =============================================== BDSG =========================================

    loadSubTerrain(subTerrain, scene, scale) {
        this.GLTFLoader.load(subTerrain.path, (obj) => {
            let model = obj.scene;
            model.scale.set(scale, scale, scale);
            model.traverse(object => {
                if('CongTrinh' == subTerrain.name && object.isGroup) {
                    object.children.forEach(obj => {
                        const objTerrainPoints = obj.name.split("_");
                        const worldPosition = new Vector3();
                        const position = obj.getWorldPosition( worldPosition );
                        let terrains = this.myTerrain.terrains;
                        if(terrains && objTerrainPoints[0] == 'wall') {
                            let found = terrains.find(item => item.name == objTerrainPoints[1]);
                            if(found) {
                                obj.name = "wall_" + found.URL;
                                let terrain = {name: found.name, position: position, url: found.URL};
                                this.terrains.push(terrain);

                                let iconToolTip = new IconToolTip("location_on", () => { window.location.href = found.URL; })
                                let tooltip = new CSS2DObject( iconToolTip.element);
                                tooltip.position.set( 0, 0, 0);
                                obj.add( tooltip );
                            }
                            
                        }
                    });
                }

                if('LedQuangCao' == subTerrain.name && object.isGroup) {
                    let standees = this.myTerrain.standees;
                    if(standees) {
                        const standee = standees.find(i => i.name == object.name);
                        if(standee && object.children[1].material.name == 'Standee') {
                            var logo = this.TextureLoader.load( standee.thumbnail, t => this.setBackground(t, 1) );
                            object.children[1].material = new MeshBasicMaterial( { map: logo } );
                            object.children[1].name = "URL_" + standee.URL + "_" + standee.thumbnail;
                            
                            let iconToolTip = new IconToolTip("help", () => this.seeBigger(standee));
                            let tooltip = new CSS2DObject( iconToolTip.element );
                            tooltip.position.set( 0, 0, 0);
                            object.children[1].add( tooltip );
                        }

                        const objTerrainPoints = object.name.split("_");
                        const map = standees.find(i => i.name == objTerrainPoints[0]);
                        if(map && objTerrainPoints[0] == 'Map') {
                            let iconToolTip = new IconToolTip("map", () => this.seeMap(map));
                            let tooltip = new CSS2DObject( iconToolTip.element );
                            tooltip.position.set( 0, 0, 0);
                            object.add( tooltip );
                        }
                    }
                }

                if('LogoCongTy' == subTerrain.name && object.isGroup) {
                    const logo = logoCTys.find(i => i.name == object.name);
                    if(logo && object.children[1].material.name.includes("WallCty")) {
                        var logoTxture = this.TextureLoader.load( logo.thumbnail, t => this.setBackground(t, 1) );
                        object.children[1].material = new MeshBasicMaterial( { map: logoTxture } );
                        object.children[1].name = "URL_" + logo.URL + "_" + logo.thumbnail;
                        
                        let iconToolTip = new IconToolTip("help", () => this.seeBigger(logo));
                        let tooltip = new CSS2DObject( iconToolTip.element );
                        tooltip.position.set( 0, 0, 0);
                        object.children[1].add( tooltip );
                    }
                }

                if (object.isMesh) {
                    const cloned = new Mesh(object.geometry, object.material);
                    object.getWorldPosition(cloned.position);
                    if (object.material.emissive && (object.material.emissive.r > 0 || object.material.emissive.g > 0 || object.material.color.b > 0)) {
                        this.bloomScene.attach(cloned);
                    }
                }
            });
            scene.add(model);
            this.generateCollider(model, scene);
        });

    }

    teleportOut(intersectResult) {
        const objURL = intersectResult.name.split("_");
        if(objURL[0] == 'wall' || objURL[0] == 'URL')
            window.location.href = objURL[1];
    }

    teleportWithin(intersectResult, prefix) {
        const objNameArray = intersectResult.name.split("_");
        const result = this.terrains.find(terrain => objNameArray[0] == prefix && terrain.name == objNameArray[1]);
        if(result) {
            LOCAL_PLAYER.position.set(result.position.x, LOCAL_PLAYER.position.y , result.position.z - 2);
        }else {
            LOCAL_PLAYER.position.set(LOCAL_PLAYER.spawnPoint.x, LOCAL_PLAYER.spawnPoint.y, LOCAL_PLAYER.spawnPoint.z);
        }
        LOCAL_PLAYER.velocity = new Vector3();
    }

    setBackground(texture, ratio) {
        texture.flipY = false;
        texture.repeat.x = ratio;
        texture.offset.x = 0.5 * (1 - ratio);
    }

    seeBigger(standee) {

        let content = new UiElement({
            type: "img",
            attributes: {
                src: standee.thumbnail
            },
            style: {
                width: '80%',
                margin: '2%'
            }
        });

        new AlertBox(null, content.element, {title: "GO", icon: ""}, {title: "CANCEL", icon: ""}, () => { window.location.href = standee.URL});
    }

    seeMap(standee) {
        let content = document.createElement('div');
        let img = document.createElement('img');
        img.src = standee.thumbnail;
        Object.assign(img.style, {
            width: '50%',
            margin: '2%'
        });

        content.appendChild(img);

        let tabsContent = new UiTab(tabs);
        content.appendChild(tabsContent.element);

        new AlertBox(null, content, null, {title: "CANCEL", icon: ""}, null);
    }
}

export { TerrainController };