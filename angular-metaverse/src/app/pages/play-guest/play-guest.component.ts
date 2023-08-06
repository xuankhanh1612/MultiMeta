import { Component, OnInit } from "@angular/core";
import { NavigationExtras, Router } from "@angular/router";
import { MediaConfig } from "src/app/api/fetch/model/MediaConfig";
import { MetaSetting } from "src/app/api/fetch/model/MetaSetting";
import { SessionService } from "src/core-js/SessionService";
import { VirtualEnvironment } from "src/core-js/VirtualEnvironment";

@Component({
  selector: "app-play-guest",
  templateUrl: "./play-guest.component.html",
  styleUrls: ["./play-guest.component.scss"],
})
export class PlayGuestComponent implements OnInit {
  isShowBubleChat: boolean = true;
  usersCount: number = 0;

  constructor(private sessionService: SessionService, private route: Router) {}

  ngOnInit(): void {
    this.init3D();
  }

  closeWindowChat() {
    this.isShowBubleChat = true;
  }

  openWindowChat() {
    this.isShowBubleChat = false;
  }

  updateUserCounts() {
    // setInterval(() => {
    //   this.usersCount = this.sessionService.virtualEnvironment.userCounts();
    // }, 10000);
  }

  goLogin(isLoadSignup: boolean) {
    const navigationExtras: NavigationExtras = {
      state: {
        isLoadSignup: isLoadSignup,
      },
    };
    this.route.navigate(["login"], navigationExtras);
  }

  init3D() {
    this.init();
    this.animate();
    this.updateUserCounts();
  }

  init() {
    const metaSetting: MetaSetting = (
      this.sessionService.metaVerseByDomain as any
    ).meta_setting;
    const mediaConfig: MediaConfig = (
      this.sessionService.metaVerseByDomain as any
    ).media_config;
    if (!metaSetting || !metaSetting.id) return;
    this.sessionService.virtualEnvironment = new VirtualEnvironment(
      "guest-view-3D",
      this.sessionService
    );
    this.sessionService.virtualEnvironment.loadTerrain(
      metaSetting.my_terrain.terrain_path,
      metaSetting.my_terrain.x,
      metaSetting.my_terrain.y,
      metaSetting.my_terrain.z,
      metaSetting.my_terrain.type,
      metaSetting.my_terrain.scale
    );
    this.sessionService.virtualEnvironment.spawnPlayer({
      spawn: metaSetting.my_avatar,
      avatarPath: metaSetting.my_avatar.avatar_path,
      animationMapping: metaSetting.my_avatar.animation_mapping,
      size: metaSetting.my_avatar.size,
    });
    // this.sessionService.virtualEnvironment.loadTerrain('//asset.airclass.io/public/terrains/baseTemplate.fbx', 0, 0, 0, "fbx")
    // this.sessionService.virtualEnvironment.spawnPlayer({spawn: {x: 0, y: 10, z: 0}});
    if (mediaConfig.video) {
      this.loadMedia("VIDEO", mediaConfig);
    }
  }

  animate() {
    this.sessionService.virtualEnvironment
      ? this.sessionService.virtualEnvironment.update()
      : "";
    requestAnimationFrame(this.animate.bind(this));
  }

  onRunAnimation(anim: string) {
    // console.log('on run animation', this.selectedAnimation);
    this.sessionService.animationPlayer(anim);
  }

  loadMedia(type = "VIDEO", mediaConfig: MediaConfig) {
    if (type == "VIDEO") {
      const playlist = mediaConfig.video.playlist;
      if (playlist) {
        let videoParams = {
          width: mediaConfig.video.width,
          height: mediaConfig.video.height,
          x: mediaConfig.video.x,
          y: mediaConfig.video.y,
          z: mediaConfig.video.z,
          w: -Math.PI / 2,
        };
        this.sessionService.virtualEnvironment.addVideoPlaylist(
          playlist,
          videoParams
        );
      }
    }

    if (type == "AUDIO") {
    }

    if (type == "EBOOK") {
    }
  }
}
