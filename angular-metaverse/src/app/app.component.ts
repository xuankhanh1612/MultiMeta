import { Component } from '@angular/core';
import { MetaService } from './api/fetch/api/meta.service';
import { LANDING_PAGE_SIGUP } from '../core-js/contants';
import { SessionService } from '../core-js/SessionService';
import { Router } from '@angular/router';
import { AccountService } from './api/fetch/api/account.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})

export class AppComponent {

    isLoading: boolean = true;

    constructor(private metaService: MetaService,
                private accountService: AccountService,
                public sessionService: SessionService,
                private route: Router) {
        this.getMetaByDomain();
    }

    getMetaByDomain() {
        this.metaService.getMetaByDomain()
            .subscribe((data: any) => {
                console.log('getMetaByDomain', data)
                this.sessionService.metaVerseByDomain = data.data;
                if(localStorage.getItem('token')) {
                    this.getUserInfo();
                } else {
                    this.isLoading = false;
                    this.route.navigate(['splash']);
                }
            }, error => {
                this.isLoading = false;
                location.href = LANDING_PAGE_SIGUP;
            });
    }

    getUserInfo() {
        this.accountService.getUserInfo()
            .subscribe((data: any) => {
                this.sessionService.userinfo = data.data;
                this.route.navigate(['home']);
                const localBalance = localStorage.getItem('balance');
                this.sessionService.balance = localBalance ? parseInt(localBalance) : 0;
                this.isLoading = false;
                console.log('UserInfo', this.sessionService.userinfo);
            }, error => {
                // go to splash
                this.isLoading = false;
            });
    }
}
