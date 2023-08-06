import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NotificationWrapperService } from '../../../services/notificationWrapper.service';
import { SessionService } from '../../../../core-js/SessionService';
import { MetaVerse } from '../../../api/fetch/model/MetaData';
import { MediaAudioDetailComponent } from '../media-audio-detail/media-audio-detail.component';
import { MEDIA_TYPES } from '../../../api/fetch/contants';
import { MediaService } from '../../../api/fetch/api/media.service';

@Component({
  selector: 'app-media-videos',
  templateUrl: './media-videos.component.html',
  styleUrls: ['./media-videos.component.scss']
})
export class MediaVideosComponent implements OnInit {

  onResult: EventEmitter<any>;

  videos: any[] = [];
  index: number = 0;
  listVideos: any[] = [];

  countButtonIndicator: number = 0;
  arrayNumerBtn: number[] = [];

  @Input() title: string = 'Videos';

  carouselId: string = '';

  constructor(private bsModalService: BsModalService,
              private bsModalRef: BsModalRef,
              private notifierService: NotificationWrapperService,
              private mediaService: MediaService,
              private sessionService: SessionService,) { }

  ngOnInit(): void {
    this.onResult = new EventEmitter();
    this.carouselId = '#carousel' + this.title;
    this.getVideos();
  }

  getVideos() {
    const meta_id = (this.sessionService.userinfo as any)?.meta_id
    this.mediaService.getMediaByMetaverse(MEDIA_TYPES.VIDEO, meta_id).subscribe((res)=>{
      this.listVideos = res.results
      this.getAudioByIndex();
    })
  }

  getAudioByIndex(){
    this.videos = this.listVideos.slice(this.index * 4, this.index * 4 + 4);
  }

  onSelectVideo(item: any) {
    // this.selectAudio.emit(item)
    console.log(item);
    const modalRef = this.bsModalService.show(MediaAudioDetailComponent, {
      class: 'modal-lg modal-dialog-centered modal-audio-detail',
      keyboard: true,
      ignoreBackdropClick: false
    });
    modalRef.content?.onRevice({
      mediaItem: item,
      mediaType: MEDIA_TYPES.VIDEO
    });
    modalRef.content?.onResult.subscribe((result: any) => {
      if (!result.isCancelled) {
        // todo somethings
      } else {
        this.onResult.emit({
          isCancelled: true
        });
        this.bsModalRef.hide();
      }
    });
  }

  onPrev(){
    this.index -=1;
    this.getAudioByIndex();
  }

  onNext(){
    this.index +=1
    this.getAudioByIndex();
    
  }
}
