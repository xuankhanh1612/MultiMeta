import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MediaComponent } from '../media/media.component';
import { ConfirmComponent } from '../confirm/confirm.component';
import { MetaVerse } from '../../api/fetch/model/MetaData';
import { MediaAudioDetailComponent } from '../media/media-audio-detail/media-audio-detail.component';
import { MEDIA_TYPES } from '../../api/fetch/contants';
import { NotificationWrapperService } from '../../services/notificationWrapper.service';
import { SessionService } from '../../../core-js/SessionService';
import { MediaService } from '../../api/fetch/api/media.service';

@Component({
  selector: 'app-ebook',
  templateUrl: './ebook.component.html',
  styleUrls: ['./ebook.component.scss']
})
export class EbookComponent implements OnInit {

  onResult: EventEmitter<any>;

  onRevice = (data: any) => {
    this.onResult = new EventEmitter();
  }

  ebooks: any[] = [];

  countButtonIndicator: number = 0;
  arrayNumerBtn: number[] = [];

  title: string = 'Ebook';

  carouselId: string = '';

  constructor(private bsModalRef: BsModalRef,
              private bsModalService: BsModalService,
              private notifierService: NotificationWrapperService,
              private sessionService: SessionService,
              private mediaService: MediaService,
              ) { }

  ngOnInit(): void {
    this.carouselId = '#carousel' + this.title;
    // this.countButtonIndicator = this.audios.length % 12 === 0 ? this.audios.length % 12 : parseInt(`${this.audios.length / 12}`) + 1;
    // this.arrayNumerBtn = Array.from(Array(this.countButtonIndicator).keys());
    this.getEbooks();
  }

  cancel() {
    this.onResult.emit({
      isCancelled: true
    });
    this.bsModalRef.hide();
  }

  getEbooks() {
    // this.ebooks = this.sessionService.metaVerseByDomain
    // && (this.sessionService.metaVerseByDomain as MetaVerse).media_config
    // && (this.sessionService.metaVerseByDomain as MetaVerse).media_config.ebook ?
    //     (this.sessionService.metaVerseByDomain as MetaVerse).media_config.ebook.playlist : [];
    // this.countButtonIndicator = this.ebooks.length % 6 === 0 ? this.ebooks.length % 6 : parseInt(`${this.ebooks.length / 6}`) + 1;
    // this.arrayNumerBtn = Array.from(Array(this.countButtonIndicator).keys());

    // // this.ebooks = this.ebooks.concat(this.ebooks).concat(this.ebooks);
    // console.log('Get ebook', this.ebooks);
    const meta_id = (this.sessionService.userinfo as any)?.meta_id
    this.mediaService.getMediaByMetaverse(MEDIA_TYPES.EBOOK, meta_id).subscribe((res)=>{
      this.ebooks = res.results
    })
    console.log('Ebook', this.ebooks)
  }

  onSelectEbook(item: any) {
    // this.selectAudio.emit(item)
    console.log(item);
    const modalRef = this.bsModalService.show(MediaAudioDetailComponent, {
      class: 'modal-lg modal-dialog-centered modal-audio-detail',
      keyboard: true,
      ignoreBackdropClick: false
    });
    modalRef.content?.onRevice({
      mediaItem: item,
      mediaType: MEDIA_TYPES.EBOOK
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

  onConfirmBuy() {
    const modalRef = this.bsModalService.show(ConfirmComponent, {
      class: 'modal-lg modal-dialog-centered modal-confirm',
      keyboard: true,
      ignoreBackdropClick: false,
      initialState: {
        imgPath: 'https://picsum.photos/152/196'
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
}
