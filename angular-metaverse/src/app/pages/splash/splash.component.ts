import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss']
})
export class SplashComponent implements OnInit {

  constructor(private route: Router) { }

  ngOnInit(): void {
  }

  goSigninPage() {
    this.route.navigate(['login']);
  }

  connectWallet() {
    //todo
  }

  playAsGuest() {
    //todo
    this.route.navigate(['guest']);
  }
}
