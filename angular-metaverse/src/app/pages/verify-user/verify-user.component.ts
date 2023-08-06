import { AfterViewInit, Component, EventEmitter, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NotificationWrapperService } from '../../services/notificationWrapper.service';
import { SessionService } from '../../../core-js/SessionService';
import { AccountService } from '../../api/fetch/api/account.service';

@Component({
  selector: 'app-verify-user',
  templateUrl: './verify-user.component.html',
  styleUrls: ['./verify-user.component.scss']
})
export class VerifyUserComponent implements OnInit, AfterViewInit {

  title1: string = 'Enter your email';
  title2: string = 'Enter the cornfirmation code';
  isEnterEmail: boolean = true;
  inputElements: NodeListOf<any>;
  code1: number;
  code2: number;
  code3: number;
  code4: number;
  code5: number;
  code6: number;
  emailConfirm: string = '';
  tokenVerify: string = '';

  onResult: EventEmitter<any>;

  onRevice = (data: any) => {
    this.onResult = new EventEmitter();
  }

  constructor(private bsModalRef: BsModalRef,
              private sessionService: SessionService,
              private accountService: AccountService,
              private notifierService: NotificationWrapperService,) { }

  ngAfterViewInit(): void {

  }

  ngOnInit(): void {
  }

  getInputElementOnDom() {
    this.inputElements = document.querySelectorAll('input.code-input');
    this.inputElements.forEach((ele,index)=>{
      ele.addEventListener('keydown',(e:any)=>{
        if(e.keyCode === 8 && e.target.value==='') this.inputElements[Math.max(0,index-1)].focus()
      })
      ele.addEventListener('input',(e: any)=>{
        const [first,...rest] = e.target.value
        e.target.value = first ?? ''
        const lastInputBox = index===this.inputElements.length-1
        const didInsertContent = first!==undefined
        if(didInsertContent && !lastInputBox) {
          this.inputElements[index+1].focus()
          this.inputElements[index+1].value = rest.join('')
          this.inputElements[index+1].dispatchEvent(new Event('input'))
        }
      })
    })
  }
  cancel() {
    this.onResult.emit({
      isCancelled: true
    });
    this.bsModalRef.hide();
  }

  onNext() {
    if (!this.validateEmail(this.emailConfirm) || this.emailConfirm !== (this.sessionService.userinfo as any).email) {
      this.notifierService.warning('Invalid email');
      return;
    }

    const metaverseId = (this.sessionService.metaVerseByDomain as any).id
    this.accountService.sendMailVerify(this.emailConfirm, metaverseId)
        .subscribe((data) => {
          this.notifierService.success('Please check your email to receive the code');
          this.tokenVerify = data.token;
          this.isEnterEmail = false;
          setTimeout(() => {
            this.getInputElementOnDom();
          }, 0);
        }, error => {
          this.notifierService.error();
        })
  }

  validateEmail(email: string): boolean {
    const re =
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return re.test(email);
  };

  onSelectByPhone() {
    this.notifierService.warning('Coming soon!!')
  }

  onConfirm() {
    if(this.tokenVerify === '' || !this.code1 || !this.code2 || !this.code3 || !this.code4 || !this.code5 || !this.code6) {
      this.notifierService.warning();
      return
    }
    const verifyCode = [
        this.code1.toString()[0],
      this.code2.toString()[0],
      this.code3.toString()[0],
      this.code4.toString()[0],
      this.code5.toString()[0],
      this.code6.toString()[0]
    ].join('');
    this.accountService.verifyMail(this.tokenVerify, verifyCode)
        .subscribe(data => {
          this.notifierService.success();
          this.getUserInfo()
        }, error => {
          this.notifierService.error()
        })
  }

  getUserInfo() {
    this.accountService.getUserInfo()
        .subscribe((data: any) => {
          this.sessionService.userinfo = data.data;
          this.cancel();
        }, error => {
        });
  }

  onResendCode() {
    this.onNext();
  }
}
