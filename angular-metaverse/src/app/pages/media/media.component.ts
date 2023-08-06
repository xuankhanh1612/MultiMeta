import { Component, EventEmitter, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaComponent implements OnInit {

  onResult: EventEmitter<any>;

  onRevice = (data: any) => {
    this.onResult = new EventEmitter();
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
