import { Component, NgZone, OnInit } from '@angular/core';
import { SessionService } from '../../../core-js/SessionService';
import { ActivatedRoute, Router } from '@angular/router';
import { MediaComponent } from '../media/media.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { EbookComponent } from '../ebook/ebook.component';
import { ShopComponent } from '../shop/shop.component';
import { MetaService } from '../../api/fetch/api/meta.service';
import { MetaVerse } from '../../api/fetch/model/MetaData';
import { VirtualEnvironment } from '../../../core-js/VirtualEnvironment';
import { MetaSetting } from '../../api/fetch/model/MetaSetting';
import { MediaConfig } from 'src/app/api/fetch/model/MediaConfig';
import { ConfirmComponent } from '../confirm/confirm.component';
import { ProfileComponent } from '../profile/profile.component';
import { HttpClient } from '@angular/common/http';
import ZoomMtgEmbedded from '@zoomus/websdk/embedded';
import { ZoomService } from '../../api/fetch/api/zoom.service';
import { ZoomModel } from '../../api/fetch/model/ZoomModel';
import { ChatModel } from '../../api/fetch/model/ChatModel';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  isShowBubleChat: boolean = true;
  isShowZoom: boolean = true;
  isShowAnim: boolean = false;
  isMetaBDSG: boolean = false;
  isTouch: boolean = false;
  userinfo: any;
  metavers: MetaVerse[] = [];
  selectedMeta: MetaVerse | undefined;
  playerAnimations: string[] = [];
  selectedAnimation: string = '';
  controlNavBars: boolean[] = [false, false, false, false, false];
  usersCount: number = 0;
  textChat: string = '';

  // Mock zoom
  // sdkKey = 'RaCicLeQxZb6er03JgcRxAOwuBuV7tHTkgfe';
  // sdkKeySecret = 'Y2S1MXnj9AfRRRJrmp51qEvsS6mIsuqCwqht';
  // meetingNumber: number;
  // passWord: string;

  meetingSelected: ZoomModel;
  signatureEndpoint = 'https://angular-zoom-sample.herokuapp.com/'
  sdkKey = 'UHuA7uHTdTtpyXklE6JC93wAFwo2TxkqmJAN'
  role = 1 //1: participants - 0: host
  userEmail = ''
  registrantToken = ''
  client = ZoomMtgEmbedded.createClient();
  listZoomsByMetaverse: ZoomModel[] = [];

  constructor(public sessionService: SessionService,
              private bsModalService: BsModalService,
              private metaService: MetaService,
              private zoomService: ZoomService,
              private activatedRoute: ActivatedRoute,
              private route: Router,
              private zone: NgZone,
              protected httpClient: HttpClient) { }

  ngOnInit(): void {
    this.userinfo = this.sessionService.userinfo;
    this.playerAnimations = this.sessionService.ANIMATIONS;
    this.initZoom();
    this.init3D();
    this.getZooms();
    this.isMetaBDSG = this.sessionService.metaVerseByDomain && (this.sessionService.metaVerseByDomain as any).group_id === 1;
    // this.isTouch = this.sessionService.detectMob();
    this.isTouch = false;
  }

  getZooms() {
    this.zoomService.getZooms()
        .subscribe((data) => {
          // this.listZoomsByMetaverse = data.results
          this.listZoomsByMetaverse = data.results.filter((it: ZoomModel) => this.sessionService.metaVerseByDomain
              && (this.sessionService.metaVerseByDomain as any).id === it.metaverse_id)
          console.log("Zooms:", this.listZoomsByMetaverse);
        }, error => {
        })
  }

  getMetaverse(segment: string | null) {
    if (segment === null) return;
    this.metaService.getMetaVerse().subscribe(
        (response) => {
          console.log('MetaVerse', response);
          this.metavers = response.results;
          this.selectedMeta = this.metavers.find(it => it.meta_setting.id && it.domain.split(".").length > 0 && it.domain.split(".")[0] === segment);
          if(this.selectedMeta) {
            this.init3D();
          } else {
            // alert warning
            this.alertWarning();
          }
        }, error => {

        }
    )
  }

  alertWarning() {
    const modalRef = this.bsModalService.show(ConfirmComponent, {
      class: 'modal-lg modal-dialog-centered modal-confirm',
      keyboard: true,
      ignoreBackdropClick: false,
      initialState: {
        title: 'No meta data',
        imgPath: './assets/img-logout.png'
      }
    });
    const data = {};
    modalRef.content?.onRevice(data);
    modalRef.content?.onResult.subscribe((result: any) => {
      if (!result.isCancelled) {
        // todo somethings
      }
    });
  }

  onChangeMeta() {
    console.log('onChangeMeta', this.selectedMeta);
    let myNode: HTMLElement | null = document.getElementById("home-view-3D");
    myNode ? myNode.innerHTML = '' : '';
    this.init3D();
  }

  updateUserCounts() {
    setInterval(() => {
      this.usersCount = this.sessionService.virtualEnvironment.userCounts();
    }, 10000);
  }

  init3D() {
    this.init();
    this.animate();
    this.updateUserCounts();
  }

  init() {
    const metaSetting: MetaSetting =(this.sessionService.metaVerseByDomain as any).meta_setting;
    const mediaConfig: MediaConfig = (this.sessionService.metaVerseByDomain as any).media_config;
    if(!metaSetting || !metaSetting.id) return
    this.sessionService.virtualEnvironment  = new VirtualEnvironment('home-view-3D', this.sessionService);
    this.sessionService.virtualEnvironment.loadTerrain(metaSetting.my_terrain.terrain_path, metaSetting.my_terrain.x, metaSetting.my_terrain.y, metaSetting.my_terrain.z, metaSetting.my_terrain.type, metaSetting.my_terrain.scale)
    this.sessionService.virtualEnvironment.spawnPlayer({spawn: metaSetting.my_avatar,
                                                        avatarPath: metaSetting.my_avatar.avatar_path,
                                                        animationMapping: metaSetting.my_avatar.animation_mapping,
                                                        size: metaSetting.my_avatar.size});
    // this.sessionService.virtualEnvironment.loadTerrain('//asset.airclass.io/public/terrains/baseTemplate.fbx', 0, 0, 0, "fbx")
    // this.sessionService.virtualEnvironment.spawnPlayer({spawn: {x: 0, y: 10, z: 0}});
    if(mediaConfig.video) {
        this.loadMedia("VIDEO", mediaConfig);
    }
  }

  animate() {
    this.sessionService.virtualEnvironment ? this.sessionService.virtualEnvironment.update() : '';
    requestAnimationFrame(this.animate.bind(this));
  }

  onRunAnimation(anim: string) {
    // console.log('on run animation', this.selectedAnimation);
    this.sessionService.animationPlayer(anim);
  }

  loadMedia(type = "VIDEO", mediaConfig: MediaConfig) {
    if(type == "VIDEO") {
      const playlist = mediaConfig.video.playlist;
      if(playlist) {
        let videoParams = {width: mediaConfig.video.width, height: mediaConfig.video.height, x: mediaConfig.video.x, y: mediaConfig.video.y, z: mediaConfig.video.z, w: - Math.PI/2};
        this.sessionService.virtualEnvironment.addVideoPlaylist(playlist, videoParams);
      }
    }

    if(type == "AUDIO") {

    }

    if(type == "EBOOK") {

    }
  }

  closeWindowChat() {
    this.isShowBubleChat = true;
  }

  openWindowChat() {
    this.isShowBubleChat = false;
  }

  openWindowZoom() {
    this.isShowZoom = !this.isShowZoom;
  }

  logout() {
    // todo need popup comfirm
    const modalRef = this.bsModalService.show(ConfirmComponent, {
      class: 'modal-lg modal-dialog-centered modal-confirm',
      keyboard: true,
      ignoreBackdropClick: false,
      initialState: {
        title: 'Do you want to logout',
        imgPath: './assets/img-logout.png'
      }
    });
    const data = {};
    modalRef.content?.onRevice(data);
    modalRef.content?.onResult.subscribe((result: any) => {
      if (!result.isCancelled) {
        this.sessionService.cleardata();
        this.route.navigate(['login']);
        window.location.reload();
      }
    });
  }

  openModalMedia() {
    this.controlNavBars[0] = true;
    const modalRef = this.bsModalService.show(MediaComponent, {
      class: 'modal-lg modal-dialog-centered modal-media',
      keyboard: true,
      ignoreBackdropClick: false
    });
    const data = {};
    modalRef.onHide?.subscribe(data => {
      this.controlNavBars[0] = false;
    })
    modalRef.content?.onRevice(data);
    modalRef.content?.onResult.subscribe((result: any) => {
      if (!result.isCancelled) {
        // todo somethings
      }
    });
  }

  openModalEbook() {
    this.controlNavBars[1] = true;
    const modalRef = this.bsModalService.show(EbookComponent, {
      class: 'modal-lg modal-dialog-centered modal-ebook',
      keyboard: true,
      ignoreBackdropClick: false
    });
    modalRef.onHide?.subscribe(data => {
      this.controlNavBars[1] = false;
    })
    const data = {};
    modalRef.content?.onRevice(data);
    modalRef.content?.onResult.subscribe((result: any) => {
      if (!result.isCancelled) {
        // todo somethings
      }
    });
  }

  openModalShop() {
    this.controlNavBars[2] = true;
    const modalRef = this.bsModalService.show(ShopComponent, {
      class: 'modal-lg modal-dialog-centered modal-ebook',
      keyboard: true,
      ignoreBackdropClick: false
    });
    modalRef.onHide?.subscribe(data => {
      this.controlNavBars[2] = false;
    })
    const data = {};
    modalRef.content?.onRevice(data);
    modalRef.content?.onResult.subscribe((result: any) => {
      if (!result.isCancelled) {
        // todo somethings
      }
    });
  }

  openProfile() {
    const modalRef = this.bsModalService.show(ProfileComponent, {
      class: 'modal-lg modal-dialog-center modal-profile',
      keyboard: true,
      ignoreBackdropClick: false
    });
    const data = {};
    modalRef.content?.onRevice(data);
    modalRef.content?.onResult.subscribe((result: any) => {
      if (!result.isCancelled) {
        // todo somethings
      }
    });
  }

  initZoom() {
    const meetingSDKElement : HTMLElement | null = document.getElementById("meetingSDKElement");

    if(!meetingSDKElement) {
        throw new Error("The element #meetingSDKElement wasn't found");
    }

    this.client.init({
      debug: true,
      zoomAppRoot: meetingSDKElement,
      language: 'en-US',
      customize: {
        meetingInfo: ['topic', 'host', 'mn', 'pwd', 'telPwd', 'invite', 'participant', 'dc', 'enctype'],
        toolbar: {
          buttons: [
            {
              text: 'Custom Button',
              className: 'CustomButton',
              onClick: () => {
                console.log('custom button');
              }
            }
          ]
        }
      }
    });

  }

  getSignature(meet: ZoomModel) {
    //0: participants - 1: host
    const role = meet.user_id === (this.sessionService.userinfo as any).id ? 1 : 0;
    this.httpClient.post(this.signatureEndpoint, {
	    meetingNumber: meet.id,
	    role: role
    }).toPromise().then((data: any) => {
      if(data.signature) {
        this.startMeeting(data.signature, meet)
      } else {
        console.log(data)
      }
    }).catch((error) => {
      console.log(error)
    })
  }

  startMeeting(signature: string, meet: ZoomModel) {
    this.zone.run(() => {
      this.client.join({
        sdkKey: this.sdkKey,
        signature: signature,
        meetingNumber: this.meetingSelected.id.toString(),
        password: this.meetingSelected.password,
        userName: this.userinfo.first_name + " " + this.userinfo.last_name,
        userEmail: this.userEmail,
        tk: this.registrantToken
      }).then(data => {
      }).catch(error => {
        console.log('startMeeting error', error);
      })
    });
  }

  openAskJoinZoom(meet: ZoomModel) {
    const modalRef = this.bsModalService.show(ConfirmComponent, {
      class: 'modal-lg modal-dialog-centered modal-confirm',
      keyboard: true,
      ignoreBackdropClick: false,
      initialState: {
        title: `Do you want to Join ${meet.topic}`,
        imgPath: './assets/img-zoom.png'
      }
    });

    const data = {};
    modalRef.content?.onRevice(data);
    modalRef.content?.onResult.subscribe((result: any) => {
      if (!result.isCancelled) {
        this.meetingSelected = meet;
        this.getSignature(meet)
      }
    });
  }

  onShowMap() {
    this.sessionService.virtualEnvironment.seeMap();
  }

  sendMsg() {
    if (this.textChat === '') return;
    const firstName = this.userinfo.first_name;
    const lastName = this.userinfo.last_name;
    const msg: ChatModel = {
      user: `${firstName} ${lastName}`,
      content: this.textChat,
      avatar: this.userinfo.avatar
    }
    this.sessionService.messages.push(msg);
    this.sessionService.virtualEnvironment.outgoingMsg(msg);
    this.textChat = '';
    setTimeout(() => this.scrollChatToBottom(), 20)
  }

  scrollChatToBottom() {
    const chatElement : HTMLElement | null = document.getElementById("home-window-chat-view");

    if(!chatElement) {
      throw new Error();
    }

    chatElement.scrollTop = chatElement.scrollHeight;
  }

}
