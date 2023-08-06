import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MediaAudioDetailComponent } from '../media-audio-detail/media-audio-detail.component';
import { MediaService } from '../../../api/fetch/api/media.service';
import { SessionService } from '../../../../core-js/SessionService';
import { MEDIA_TYPES } from '../../../api/fetch/contants';
import { MetaVerse } from '../../../api/fetch/model/MetaData';

interface MediaAudio {
  url: string;
  name: string;
  cover_link: string;
  price: string;
  currency: string
}

@Component({
  selector: 'app-media-items',
  templateUrl: './media-items.component.html',
  styleUrls: ['./media-items.component.scss']
})
export class MediaItemsComponent implements OnInit {

  onResult: EventEmitter<any>;

  audios: MediaAudio[] = [];
  listAudio: MediaAudio[] = [];
  countButtonIndicator: number = 0;
  index: number = 0;
  arrayNumerBtn: number[] = [];

  @Input() title: string = 'Audio';
  @Output() selectAudio = new EventEmitter<any>();

  carouselId: string = '';

  constructor(private bsModalService: BsModalService,
              private bsModalRef: BsModalRef,
              private mediaService: MediaService,
              private sessionService: SessionService) {
  }

  ngOnInit(): void {
    this.onResult = new EventEmitter();
    this.carouselId = '#carousel' + this.title;
    this.getAudio();
  }

  getAudio() {
    // this.audios = this.sessionService.metaVerseByDomain
    //     && (this.sessionService.metaVerseByDomain as MetaVerse).media_config
    //     && (this.sessionService.metaVerseByDomain as MetaVerse).media_config.audio ?
    //     (this.sessionService.metaVerseByDomain as MetaVerse).media_config.audio.playlist : [];
    

    // this.audios = this.audios.concat(this.audios).concat(this.audios);
    // console.log('Get audio with', this.audios);
    const meta_id = (this.sessionService.userinfo as any)?.meta_id
    this.mediaService.getMediaByMetaverse(MEDIA_TYPES.AUDIO, meta_id).pipe().subscribe((res)=>{
      this.listAudio = res.results
      this.index = 0
      this.getAudioByIndex()
    })
  }

  getAudioByIndex(){
    this.audios = this.listAudio.slice(this.index * 6, this.index * 6 + 6);
  }

  onSelectAudio(item: any) {
    // this.selectAudio.emit(item)
    const modalRef = this.bsModalService.show(MediaAudioDetailComponent, {
      class: 'modal-lg modal-dialog-centered modal-audio-detail',
      keyboard: true,
      ignoreBackdropClick: false
    });
    modalRef.content?.onRevice({
      mediaItem: item,
      mediaType: MEDIA_TYPES.AUDIO
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
    this.index -=1
    this.getAudioByIndex()
  }

  onNext(){
    this.index +=1
    this.getAudioByIndex()
    
  }
}
