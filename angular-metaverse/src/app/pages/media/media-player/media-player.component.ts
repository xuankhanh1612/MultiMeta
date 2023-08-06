import { Component, EventEmitter, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import videojs from 'video.js';

@Component({
  selector: 'app-media-player',
  templateUrl: './media-player.component.html',
  styleUrls: ['./media-player.component.scss']
})
export class MediaPlayerComponent implements OnInit {

  onResult: EventEmitter<any>;
  mediaItem: any;
  onRevice = (data: any) => {
    this.onResult = new EventEmitter();
    this.mediaItem = data;
  }

  player: videojs.Player;

  constructor(private bsModalRef: BsModalRef) { }

  ngOnInit(): void {
    // this.player = videojs('my-player', {}, function onPlayerReady() {
    //   console.log('onPlayerReady', this);
    // });
  }

  ngOnDestroy() {
    // if (this.player) {
    //   this.player.dispose();
    // }
  }

  cancel() {
    this.onResult.emit({
      isCancelled: true
    });
    this.bsModalRef.hide();
  }
}
