import { AfterViewInit, Component, OnInit } from '@angular/core';
import { VirtualEnvironment } from '../../../core-js/VirtualEnvironment';
import { SessionService } from '../../../core-js/SessionService';
import { MetaService } from '../../api/fetch/api/meta.service';
import { MetaSetting } from 'src/app/api/fetch/model/MetaSetting';
import { MediaConfig } from 'src/app/api/fetch/model/MediaConfig';
import { AccountService } from '../../api/fetch/api/account.service';


interface MenuItem {
    name: string,
    isActive: boolean
}

@Component({
    selector: 'app-play-meta',
    templateUrl: './play-meta.component.html',
    styleUrls: ['./play-meta.component.scss']
})
export class PlayMetaComponent implements OnInit, AfterViewInit {

    // UI
    isShowPanel: boolean = false;
    menuItems: MenuItem[] = [
        {name: 'Chat', isActive: false},
        {name: 'Multiplayer', isActive: true},
        {name: 'Avatar', isActive: false},
        {name: 'Options', isActive: false},
        {name: 'Playlist', isActive: false}
    ];
    itemSelected: MenuItem = this.menuItems[1];
    // 3D
    virtualEnvironment: any;

    constructor(public sessionService: SessionService,
                private accountService: AccountService,
                public metaService: MetaService) {
        // this.login();
    }

    ngOnInit(): void {

    }

    ngAfterViewInit(): void {
        this.virtualEnvironment  = new VirtualEnvironment();
        this.init();
        this.animate();
    }

    activeMenuItem(item: MenuItem) {
        this.menuItems = this.menuItems.map(it => {
            it.isActive = it.name === item.name;
            return it;
        })
        this.itemSelected = item;
    }

    expansionPanel() {
        this.isShowPanel = !this.isShowPanel;
    }

    init() {
        const metaSetting: MetaSetting = (this.sessionService.metaVerseByDomain as any).meta_setting;
        const mediaConfig: MediaConfig = (this.sessionService.metaVerseByDomain as any).meta_config;
        this.virtualEnvironment.loadTerrain(metaSetting.my_terrain.terrain_path, metaSetting.my_terrain.x, metaSetting.my_terrain.y, metaSetting.my_terrain.z, metaSetting.my_terrain.type, metaSetting.my_terrain.scale)
        this.virtualEnvironment.spawnPlayer({spawn: metaSetting.my_avatar});

        if(mediaConfig) {
            const playlist = mediaConfig.video.playlist;
            let videoParams = {width: mediaConfig.video.width, height: mediaConfig.video.height, x: mediaConfig.video.x, y: mediaConfig.video.y, z: mediaConfig.video.z, w: - Math.PI/2};
            this.virtualEnvironment.addVideoPlaylist(playlist, videoParams);
        }
        // this.virtualEnvironment.loadTerrain('//asset.airclass.io/public/terrains/baseTemplate.fbx', 0, 0, 0, "fbx")
        // this.virtualEnvironment.spawnPlayer({spawn: {x: 0, y: 10, z: 0}});
    }

    animate() {
        this.virtualEnvironment ? this.virtualEnvironment.update() : '';
        requestAnimationFrame(this.animate.bind(this));
    }

    login() {
        this.accountService.getToken({
            "email": "nam.vh@gmail.com",
            "password": "admin"
        }).subscribe((data) => {
            console.log(data.access);
            console.log(data.refresh);

            localStorage.setItem('token', data.access);
            localStorage.setItem('refresh', data.refresh);
            this.getUserInfo();
        })
    }

    getUserInfo() {
        this.accountService.getUserInfo()
            .subscribe((data) => {
            console.log('data', data);
        })
    }

    getModels() {
        this.metaService.getModels3D().subscribe((data) => {
            console.log('Data getModels3D', data);
        }, error => {
            console.log(error);
        })
    }

    getMetaVerse() {
        this.metaService.getMetaVerse().subscribe((data) => {
            console.log('Data getMetaVerse', data);
        }, error => {
            console.log(error);
        })
    }

    requestMetaData() {
        this.metaService.getMetaData("https://api.multimeta.one/api")
            .subscribe((data) => {
                console.log('requestMetaData', data);
            }, error => {
                console.log('error', error);
            })
    }
}
