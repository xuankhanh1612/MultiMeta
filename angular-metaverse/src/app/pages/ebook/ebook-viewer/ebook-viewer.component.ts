import { Component, EventEmitter, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-ebook-viewer',
  templateUrl: './ebook-viewer.component.html',
  styleUrls: ['./ebook-viewer.component.scss']
})
export class EbookViewerComponent implements OnInit {

  onResult: EventEmitter<any>;
  mediaItem: any;
  onRevice = (data: any) => {
    this.onResult = new EventEmitter();
    this.mediaItem = data;
  }

  constructor(private bsModalRef: BsModalRef) { }

  ngOnInit(): void {
  }

  cancel() {
    this.onResult.emit({
      isCancelled: true
    });
    this.bsModalRef.hide();
  }
}
