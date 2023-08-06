import { Component, EventEmitter, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {

  onResult: EventEmitter<any>;

  onRevice = (data: any) => {
    this.onResult = new EventEmitter();
  }

  audios: any[] = [
    {image: "https://picsum.photos/152/196", name: "Ice scream", price: "6$"},
    {image: "https://loremflickr.com/152/196", name: "Why not me", price: "10$"},
    {image: "https://picsum.photos/152/196", name: "Ice scream", price: "6$"},
    {image: "https://loremflickr.com/152/196", name: "Why not me", price: "10$"},
    {image: "https://picsum.photos/152/196", name: "Ice scream", price: "6$"},
    {image: "https://loremflickr.com/152/196", name: "Why not me", price: "10$"},
    {image: "https://loremflickr.com/152/196", name: "Why not me", price: "10$"},
    {image: "https://loremflickr.com/152/196", name: "Why not me", price: "10$"},
    {image: "https://picsum.photos/152/196", name: "Ice scream", price: "6$"},
    {image: "https://loremflickr.com/152/196", name: "Why not me", price: "10$"},
    {image: "https://picsum.photos/152/196", name: "Ice scream", price: "6$"},
    {image: "https://loremflickr.com/152/196", name: "Why not me", price: "10$"},
    {image: "https://picsum.photos/152/196", name: "Ice scream", price: "6$"},
    {image: "https://loremflickr.com/152/196", name: "Why not me", price: "10$"},
    {image: "https://picsum.photos/152/196", name: "Ice scream", price: "6$"},
    {image: "https://loremflickr.com/152/196", name: "Why not me", price: "10$"},
    {image: "https://picsum.photos/152/196", name: "Ice scream", price: "6$"},
  ];

  countButtonIndicator: number = 0;
  arrayNumerBtn: number[] = [];

  constructor(private bsModalRef: BsModalRef,
              private bsModalService: BsModalService) { }

  ngOnInit(): void {
    this.countButtonIndicator = this.audios.length % 8 === 0 ? this.audios.length % 8 : parseInt(`${this.audios.length / 8}`) + 1;
    this.arrayNumerBtn = Array.from(Array(this.countButtonIndicator).keys());
  }

  cancel() {
    this.onResult.emit({
      isCancelled: true
    });
    this.bsModalRef.hide();
  }
}
