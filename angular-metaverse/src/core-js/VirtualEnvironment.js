import * as THREE from 'three';
import { WebGLRenderer, VSMShadowMap, PerspectiveCamera, Vector3, LoadingManager, Clock, Matrix4, Raycaster, Mesh, MeshLambertMaterial, PlaneGeometry, VideoTexture } from 'three';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

import { PlayerLocal } from './entities/PlayerLocal.js';

import { TerrainController } from './terrain/TerrainController.js';

import { DefaultScene } from "./render/DefaultScene.js"

import {loadingBar, loadingPage} from './UserInterface/Common/loadingPage.js';
import { ID_CANVAS_VIEW_3D } from './contants.js';
import { PhotonController } from './util/PhotonController.js';

const clock = new Clock();

export class VirtualEnvironment {
    sessionService;
    constructor(appendID = ID_CANVAS_VIEW_3D, sessionService) {
        this.sessionService = sessionService;
        this.myTerrain = this.sessionService.metaVerseByDomain.meta_setting.my_terrain;
        // this.touch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
        // this.touch = this.sessionService.detectMob();
        this.touch = false;
        // uncomment to enable mobile controls - currently it detects between iphones and desktops.
        // this.touch = this.sessionService.detectMob();
        window.PARENT_VIEW = document.getElementById(appendID);

        // ===== loading =====
        this.loading();

        // inject this n the window
        window.VIRTUAL_ENVIRONMENT = this;

        // ===== renderer =====
        this.renderer = new WebGLRenderer({ alpha: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = VSMShadowMap;

        PARENT_VIEW.appendChild(this.renderer.domElement);

        // ===== 2D renderer =====
        this.labelRenderer = new CSS2DRenderer();
        this.labelRenderer.setSize( window.innerWidth-1, window.innerHeight-1 );
        this.labelRenderer.domElement.style.position = 'absolute';
        this.labelRenderer.domElement.style.top = '0px';
        PARENT_VIEW.appendChild( this.labelRenderer.domElement );

        // ===== scene =====
        window.MAIN_SCENE = new DefaultScene();

        // ===== sky =======
        let backgroundURL = this.myTerrain.background;
        if(backgroundURL) {
            const loader = new THREE.TextureLoader();
            const bgTexture = loader.load(backgroundURL);
            bgTexture.mapping = THREE.EquirectangularReflectionMapping;
            MAIN_SCENE.background = bgTexture;
        }

        // ===== camera =====
        this.camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 500);
        this.dummyCamera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 500);
        this.cameraPosition = new Vector3();
        this.cameraTarget = new Vector3();

        // ===== Terrain Controller
        this.terrainController = new TerrainController(this.loadingManager, this.myTerrain);

        // ===== setup resize listener ==========
        window.addEventListener('resize', () => onWindowResize(this.camera, this.renderer, this.labelRenderer), false);

        function onWindowResize(camera, renderer, labelRenderer) {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            labelRenderer.setSize(window.innerWidth - 1, window.innerHeight - 1);
        }

        // ===== setup Multiplayer =====
        this.photonController = new PhotonController();

        // ============ setup raycaster ================
        this.raycaster = new THREE.Raycaster();


    } // -- end constructor

    loadTerrain(terrainPath, x, y, z, format, scaleFactor = 1){
        this.terrainController.loadTerrain(terrainPath, MAIN_SCENE, x, y, z, format, scaleFactor);
    }

    reloadTerrain(terrainPath, scale) {
        this.terrainController.reloadTerrain(terrainPath, MAIN_SCENE, scale);
    }

    spawnPlayer(params) {
        console.log("spawning LOCAL_PLAYER");
        window.LOCAL_PLAYER = new PlayerLocal(params, this.dummyCamera, this.loadingManager);
        MAIN_SCENE.add(LOCAL_PLAYER);
    }

    // ======================================== VIDEO PLAYER ================================

    playVideo(url) {
        let video = this.videos.filter(item => item.id === url)[0];
        if(!video) return;
        PARENT_VIEW.appendChild(video);

        let width = this.videoParams.width;
        let height = this.videoParams.height;
        let x = this.videoParams.x;
        let y = this.videoParams.y;
        let z = this.videoParams.z;
        let rotationY = this.videoParams.w;

        const mesh = new Mesh(
            new PlaneGeometry( width, height ),
            new MeshLambertMaterial({
                color: 0xffffff,
                map: new VideoTexture( video )
            })
        );
        mesh.position.set(x, y, z)
        mesh.rotateY(rotationY)

        MAIN_SCENE.add( mesh )

        video.play();
    }

    pauseVideo(url) {
        let video = this.videos.filter(item => item.id === url)[0];
        if(!video) return;
        video.pause();
    }

    rewindVideo(url) {
        let video = this.videos.filter(item => item.id === url)[0];
        if(!video) return;
        video.currentTime = 0;
    }

    newVideoDisplayPlane(url, width, height, x, y, z, rotationY) {
        const video = document.createElement('video');
        video.id = url; // give unique id to support multiple players
        video.loop = true;
        video.crossOrigin = "anonymous";
        video.playsinline = true;
        video.style.display = "none";

        const source =  document.createElement('source')
        source.src = url;
        source.type = 'video/mp4';

        video.appendChild(source);
        document.body.appendChild(video)

        document.onkeydown = function(e) {
            if (e.keyCode == 80 && !this.videoHasPlayed) {
                //p - play
                video.play();
                this.videoHasPlayed = true;
            } else if (e.keyCode == 80 && this.videoHasPlayed) {
                //p - pause
                this.videoHasPlayed = false;
                video.pause();
            } else if (e.keyCode == 82) {
                //r - rewind video
                video.currentTime(0);
            }

        }

        const mesh = new Mesh(
            new PlaneGeometry( width, height ),
            new MeshLambertMaterial({
                color: 0xffffff,
                map: new VideoTexture( video )
            })
        );
        mesh.position.set(x,y,z)
        mesh.rotateY(rotationY)

        MAIN_SCENE.add( mesh )
    }

    loading() {
        // ===== loading manager =====
        this.loadingManager = new LoadingManager();

        loadingPage();
        loadingBar(this.loadingManager);
    }

    // ====================================== BDSG ============================

    seeMap() {
        if(this.myTerrain.standees) {
            let map = this.myTerrain.standees.find(item => item.name == 'Map');
            if(map) {
                this.terrainController.seeMap(map);
            }
        }
    }

    // ================================ PHOTON MULTIPLAYER =====================

    userCounts() {
        return this.photonController.actorCounts();
    }

    incommingMsg(msg) {
        this.sessionService.messages.push(msg);
    }

    outgoingMsg(msg) {
        this.photonController.sendMessage(msg);
    }
    
    disconnect() {
        this.photonController.disconnect();
    }

    // =================================== READY PLAYER ME ==========================

    changeCharacter() {
        LOCAL_PLAYER.changeCharacter();
    }



    //-------------------UPDATE FRAME----------------------//

    update() {

        MAIN_SCENE.update();

        this.delta = Math.min(clock.getDelta(), 0.1);
        if (this.terrainController.collider) {

            LOCAL_PLAYER.update(this.delta, this.terrainController.collider);
            this.camera.position.copy(LOCAL_PLAYER.position);
            const dir = this.dummyCamera.getWorldDirection(new Vector3());
            this.camera.position.add(dir.multiplyScalar(LOCAL_PLAYER.controlVector.z));
            this.camera.lookAt(LOCAL_PLAYER.position);
            const invMat = new Matrix4();
            const raycaster = new Raycaster(LOCAL_PLAYER.position.clone(), this.camera.position.clone().sub(LOCAL_PLAYER.position.clone()).normalize());
            invMat.copy(this.terrainController.collider.matrixWorld).invert();
            raycaster.ray.applyMatrix4(invMat);
            const hit = this.terrainController.collider.geometry.boundsTree.raycastFirst(raycaster.ray);
            if (hit) {
                this.camera.position.copy(LOCAL_PLAYER.position);
                const dir = this.dummyCamera.getWorldDirection(new Vector3());
                this.camera.position.add(dir.multiplyScalar(Math.min(hit.point.distanceTo(LOCAL_PLAYER.position), LOCAL_PLAYER.controlVector.z * 1.25) * 0.8));
                this.camera.lookAt(LOCAL_PLAYER.position);
            }
            this.cameraPosition.lerp(this.camera.position, LOCAL_PLAYER.controlVector.w);
            this.cameraTarget.lerp(LOCAL_PLAYER.position, LOCAL_PLAYER.controlVector.w);
            this.camera.position.copy(this.cameraPosition);
            this.camera.lookAt(this.cameraTarget);

        }
        this.renderer.render(MAIN_SCENE, this.camera);
        this.labelRenderer.render(MAIN_SCENE, this.camera);
    }
}
