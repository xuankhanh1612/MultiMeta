import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {

  @Input() title: string = 'Do you want to buy?'
  @Input() imgPath: string = ''
  onResult: EventEmitter<any>;
  media: any;

  onRevice = (data: any) => {
    console.log(data);
    
    this.media = data
    this.onResult = new EventEmitter();
  }

  constructor(private bsModalRef: BsModalRef, private route: Router) { }

  ngOnInit(): void {
  }

  cancel() {
    this.onResult.emit({
      isCancelled: true
    });
    this.bsModalRef.hide();
  }
  submit() {
    this.onResult.emit({
      isCancelled: false
    });
    this.bsModalRef.hide();
    this.route.navigate(['splash']);
  }
}
