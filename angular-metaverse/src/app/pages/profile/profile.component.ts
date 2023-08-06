import { Component, EventEmitter, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { VerifyUserComponent } from '../verify-user/verify-user.component';
import { SessionService } from '../../../core-js/SessionService';
import { MetaService } from '../../api/fetch/api/meta.service';
import { NotificationWrapperService } from '../../services/notificationWrapper.service';
import { AccountService } from '../../api/fetch/api/account.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {


  firstName: string = '';
  lastName: string = '';
  username: string = ''
  phone: string = '';
  email: string = '';
  avatar: string = '';
  isDisableEditName: boolean = true;
  fileSelected: File;
  isVerifyPhone: boolean = false;
  isVerifyEmail: boolean = false;

  onResult: EventEmitter<any>;

  onRevice = (data: any) => {
    this.onResult = new EventEmitter();
    this.firstName = (this.sessionService.userinfo as any).first_name;
    this.lastName = (this.sessionService.userinfo as any).last_name;
    this.username = `${this.firstName} ${this.lastName}`;
    this.email = (this.sessionService.userinfo as any).email;
    this.phone = (this.sessionService.userinfo as any).phone;
    this.isVerifyPhone = (this.sessionService.userinfo as any).verified_phone;
    this.isVerifyEmail = (this.sessionService.userinfo as any).verified_mail;
    this.avatar = (this.sessionService.userinfo as any).avatar;
  }

  constructor(private bsModalRef: BsModalRef,
              private metaService: MetaService,
              private accountService: AccountService,
              private notifierService: NotificationWrapperService,
              private sessionService: SessionService,
              private bsModalService: BsModalService) { }

  ngOnInit(): void {
  }

  cancel() {
    this.onResult.emit({
      isCancelled: true
    });
    this.bsModalRef.hide();
  }

  onVerify() {
    this.cancel();
    const modalRef = this.bsModalService.show(VerifyUserComponent, {
      class: 'modal-lg modal-dialog-centered modal-confirm',
      keyboard: true,
      ignoreBackdropClick: false,
    });
    const data = {};
    modalRef.content?.onRevice(data);
    modalRef.content?.onResult.subscribe((result: any) => {
      if (!result.isCancelled) {
        // todo somethings
      }
    });
  }

  onChangeFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => this.avatar = reader.result as any;
      this.fileSelected = file;
      reader.readAsDataURL(file);
    }
  }

  onSave() {
    let formdata = new FormData();
    let isNoChanged: boolean = true;
    this.firstName !== (this.sessionService.userinfo as any).first_name
        ? formdata.append("first_name", this.firstName) : isNoChanged = false;
    this.lastName !== (this.sessionService.userinfo as any).last_name
        ? formdata.append("last_name", this.lastName) : isNoChanged = false;
    this.phone !== (this.sessionService.userinfo as any).phone
        ? formdata.append("phone", this.phone) : isNoChanged = false;
    this.fileSelected ? formdata.append("avatar_upload", this.fileSelected, this.fileSelected.name) : isNoChanged = false
    const userId = (this.sessionService.userinfo as any).id;
    // if(isNoChanged) {
    //   this.notifierService.warning('No information change');
    //   return;
    // }
    this.accountService.updateUserInfo(userId, formdata)
        .subscribe((data) => {
          this.notifierService.success();
        }, error => {
          this.notifierService.error();
        })
  }

  onChangeCharacter() {
    this.sessionService.virtualEnvironment.changeCharacter();
    this.cancel();
  }
}
