import { Component, EventEmitter, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmComponent } from '../../confirm/confirm.component';
import { SessionService } from '../../../../core-js/SessionService';
import { NotificationWrapperService } from '../../../services/notificationWrapper.service';
import $ from 'jquery';
import { MediaPlayerComponent } from '../media-player/media-player.component';
import { MEDIA_TYPES } from '../../../api/fetch/contants';
import { EbookViewerComponent } from '../../ebook/ebook-viewer/ebook-viewer.component';

@Component({
    selector: 'app-media-audio-detail',
    templateUrl: './media-audio-detail.component.html',
    styleUrls: ['./media-audio-detail.component.scss']
})
export class MediaAudioDetailComponent implements OnInit {
    onResult: EventEmitter<any>;

    mediaItem: any;
    mediaType: MEDIA_TYPES = MEDIA_TYPES.NONE;

    constructor(private bsModalRef: BsModalRef,
                private notifierService: NotificationWrapperService,
                private sessionService: SessionService,
                private bsModalService: BsModalService) {
    }

    onRevice = (data: any) => {
        this.onResult = new EventEmitter();
        this.mediaItem = data.mediaItem;       
        this.mediaType = data.mediaType;        
    };

    ngOnInit(): void {
    }

    cancel() {
        this.onResult.emit({
            isCancelled: true
        });
        this.bsModalRef.hide();
    }

    onConfirmBuy() {
        const modalRef = this.bsModalService.show(ConfirmComponent, {
            class: 'modal-lg modal-dialog-centered modal-confirm',
            keyboard: true,
            ignoreBackdropClick: false,
            initialState: {
                imgPath: this.mediaItem.cover
            }
        });
        modalRef.content?.onRevice(this.mediaItem);
        modalRef.content?.onResult.subscribe((result: any) => {
            if (!result.isCancelled) {
                // todo somethings
                this.sessionService.balance > parseInt(this.mediaItem.price.replace(/\D/g, "")) ? this.sessionService.balance -= parseInt(this.mediaItem.price.replace(/\D/g, "")) : '';
                localStorage.setItem('balance', `${this.sessionService.balance}`);
                this.notifierService.success('Buy success');
            }
        });
    }

    onPlay() {
        switch (this.mediaType) {
            case MEDIA_TYPES.AUDIO:
                this.onPlayAudio();
                break
            case MEDIA_TYPES.VIDEO:
                this.onPlayVideo();
                break
            case MEDIA_TYPES.EBOOK:
                this.onReadEbook();
                break
            default:
                break
        }
    }

    onPlayAudio() {
        const playerAudio: HTMLElement | null = document.getElementById('playerAudio');

        if (!playerAudio) {
            throw new Error('The element #playerAudio wasn\'t found');
        }
        playerAudio.innerHTML =
            `
        <div class="window-audio-player">
          <div class="titlebar d-flex justify-content-between">
            <p class="p-0 m-0">Audio Player</p>
            <div class="home-window-close btn-close-audio-player" id="btn-close-audio-player">
                <img class="home-window-close-img" src="./assets/icons/ic-plus.svg" alt="">
            </div>
          </div>
          <div class="content"> 
            <audio controls>
                <source src="${this.mediaItem.url}">
            </audio>
          </div>
        </div>
       
        `;

        $('.btn-close-audio-player').click(function () {
            const playerAudio: HTMLElement | null = document.getElementById('playerAudio');

            if (!playerAudio) {
                throw new Error('The element #playerAudio wasn\'t found');
            } else {
                playerAudio.innerHTML = ''
            }
        })

        this.onResult.emit({
            isCancelled: true
        });
        this.bsModalRef.hide();
    }

    onPlayVideo() {
        const modalRef = this.bsModalService.show(MediaPlayerComponent, {
            class: 'modal-lg modal-dialog-centered modal-player',
            keyboard: true,
            ignoreBackdropClick: false
        });
        modalRef.content?.onRevice(this.mediaItem);
        modalRef.content?.onResult.subscribe((result: any) => {
            if (!result.isCancelled) {
                // todo somethings
            }
        });

        this.onResult.emit({
            isCancelled: true
        });
        this.bsModalRef.hide();
    }

    onReadEbook() {
        const modalRef = this.bsModalService.show(EbookViewerComponent, {
            class: 'modal-lg modal-dialog-centered modal-ebook',
            keyboard: true,
            ignoreBackdropClick: false
        });
        modalRef.content?.onRevice(this.mediaItem);
        modalRef.content?.onResult.subscribe((result: any) => {
            if (!result.isCancelled) {
                // todo somethings
            }
        });

        this.onResult.emit({
            isCancelled: true
        });
        this.bsModalRef.hide();
    }
}
