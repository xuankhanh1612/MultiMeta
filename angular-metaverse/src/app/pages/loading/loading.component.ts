import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../../core-js/SessionService';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {

  dots: number[] = Array.from(Array(37).keys());
  // loaded: number = 0;

  constructor(public sessionService: SessionService) { }

  ngOnInit(): void {
  }
}
