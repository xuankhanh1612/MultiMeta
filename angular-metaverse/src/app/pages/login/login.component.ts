import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../../../core-js/SessionService';
import { NotificationWrapperService } from 'src/app/services/notificationWrapper.service';
import { AccountService } from '../../api/fetch/api/account.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    isLogin: boolean = true;
    isForgotPwd: boolean = false;
    formLogin: { email: string, password: string } = { email: '', password: '' };
    formSignup: { email: string, password: string, confirmPassword: string } = {
        email: '',
        password: '',
        confirmPassword: ''
    };
    formForgotPwd: {email: string} = {email: ''}

    constructor(private route: Router,
                private notifierService: NotificationWrapperService,
                private accountService: AccountService,
                private sessionService: SessionService) {
        const navigation = route.getCurrentNavigation();
        const state = navigation?.extras.state as {
            isLoadSignup: boolean
        };
        this.isLogin = state === undefined || !state.isLoadSignup;
    }

    ngOnInit(): void {
    }

    switchLoginSignup() {
        this.isLogin = !this.isLogin;
    }

    signup() {
        if (!this.validateEmail(this.formSignup.email)) {
            this.notifierService.warning('Invalid email');
            return;
        }
        if (this.formSignup.password === '' || this.formSignup.password !== this.formSignup.confirmPassword) {
            this.notifierService.warning('Invalid password');
            return;
        }
        this.accountService.signup({ email: this.formSignup.email, password: this.formSignup.password })
            .subscribe(data => {
                this.notifierService.success();
                this.isLogin = true;
            }, error => {
                this.notifierService.error();
            });
    }

    validateEmail(email: string): boolean {
        const re =
            /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return re.test(email);
    };

    playAsGuest() {
        this.route.navigate(['guest']);
    }

    login() {
        if (!this.validateEmail(this.formLogin.email)) {
            this.notifierService.warning('Invalid email');
            return;
        }
        this.accountService.getToken(this.formLogin).subscribe((data) => {
            localStorage.setItem('token', data.access);
            localStorage.setItem('refresh', data.refresh);
            localStorage.setItem('balance', '1000');
            this.sessionService.balance = 1000;
            this.getUserInfo();
            window.location.reload();
        }, error => {
            this.sessionService.cleardata();
            this.notifierService.error();
        });
    }

    getUserInfo() {
        this.accountService.getUserInfo()
            .subscribe((data: any) => {
                this.sessionService.userinfo = data.data;
                this.route.navigate(['home']);
                this.notifierService.success();
            }, error => {
                this.notifierService.error();
            });
    }

    openViewForgotPassword() {
        this.isForgotPwd = !this.isForgotPwd;
    }

    submitForgotPwd() {
        if (!this.validateEmail(this.formForgotPwd.email)) {
            this.notifierService.warning('Invalid email');
            return;
        }

        this.accountService.forgotPassword(this.formForgotPwd.email)
            .subscribe((data) => {
                this.notifierService.success('Please check your email!');
            }, error => {
                this.notifierService.error();
            })
    }
}
