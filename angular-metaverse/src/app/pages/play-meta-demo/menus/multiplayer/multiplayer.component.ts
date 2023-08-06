import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-multiplayer',
  templateUrl: './multiplayer.component.html',
  styleUrls: ['./multiplayer.component.scss']
})
export class MultiplayerComponent implements OnInit {

  hasConnection: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  goConnectionList() {
    this.hasConnection = true;
  }
}
