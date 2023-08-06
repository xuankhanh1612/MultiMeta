import { Component, EventEmitter, Inject, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';

import { ZoomMtg } from '@zoomus/websdk';
import { SessionService } from '../../../core-js/SessionService';
import { BsModalRef } from 'ngx-bootstrap/modal';

ZoomMtg.setZoomJSLib('https://source.zoom.us/2.6.0/lib', '/av');

ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();
// loads language files, also passes any error messages to the ui
ZoomMtg.i18n.load('en-US');
ZoomMtg.i18n.reload('en-US');

@Component({
  selector: 'app-zoom',
  templateUrl: './zoom.component.html',
  styleUrls: ['./zoom.component.scss']
})
export class ZoomComponent implements OnInit {

  onResult: EventEmitter<any>;

  sdkKey = 'RaCicLeQxZb6er03JgcRxAOwuBuV7tHTkgfe';
  sdkKeySecret = 'Y2S1MXnj9AfRRRJrmp51qEvsS6mIsuqCwqht';
  meetingNumber: number;
  passWord: string;

  onRevice = (data: any) => {
    this.onResult = new EventEmitter();
    this.meetingNumber = 81905230602;
    this.passWord = 'mc1cah';
  }

  constructor(public httpClient: HttpClient,
              @Inject(DOCUMENT) document: any,
              private bsModalRef: BsModalRef,
              public sessionService: SessionService,) { }

  ngOnInit(): void {
    this.getSignatureByMockApi(1)
  }

  getSignatureByMockApi(role: number) {

    // const iat = Math.round(new Date().getTime() / 1000) - 30;
    // const exp = iat + 60 * 60 * 2
    //
    // const oHeader = { alg: 'HS256', typ: 'JWT' }
    //
    // const oPayload = {
    //   sdkKey: 'RaCicLeQxZb6er03JgcRxAOwuBuV7tHTkgfe',
    //   mn: this.meetingNumber,
    //   role: role,
    //   iat: iat,
    //   exp: exp,
    //   appKey: 'RaCicLeQxZb6er03JgcRxAOwuBuV7tHTkgfe',
    //   tokenExp: iat + 60 * 60 * 2
    // }
    //
    // const sHeader = JSON.stringify(oHeader)
    // const sPayload = JSON.stringify(oPayload)
    // const signature = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, 'Y2S1MXnj9AfRRRJrmp51qEvsS6mIsuqCwqht');

    const signature = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZGtLZXkiOiJSYUNpY0xlUXhaYjZlcjAzSmdjUnhBT3d1QnVWN3RIVGtnZmUiLCJtbiI6IjgxOTA1MjMwNjAyIiwicm9sZSI6MSwiaWF0IjoxNjYyNzk4ODEzLCJleHAiOjE2NjI4MDYwMTMsImFwcEtleSI6IlJhQ2ljTGVReFpiNmVyMDNKZ2NSeEFPd3VCdVY3dEhUa2dmZSIsInRva2VuRXhwIjoxNjYyODA2MDEzfQ.E97KYta2CcFD9YId04jy-_nLkrcFWHvdGUaSknQsrFM"

    this.startMeeting(signature);

    // this.httpClient.post(`${this.signatureEndpoint}joinmeeting`, {
    //   meetingNumber: this.meetingNumber,
    //   role
    // }).toPromise().then((data: any) => {
    //   if (data.signature) {
    //     console.log(data.signature);
    //     this.startMeeting(data.signature);
    //   } else {
    //     console.log(data);
    //   }
    // }).catch((error) => {
    //   console.log(error);
    // });
  }



  startMeeting(signature: string) {

    // @ts-ignore
    document.getElementById('zmmtg-root').style.display = 'block';


    const leaveUrl = location.host;
    const userName = 'username';
    const userEmail = (this.sessionService.userinfo as any).email;
    const registrantToken = '';

    ZoomMtg.init({
      leaveUrl: leaveUrl,
      success: (success: any) => {
        console.log(success);
        ZoomMtg.join({
          signature,
          meetingNumber: this.meetingNumber,
          userName: userName,
          sdkKey: this.sdkKey,
          userEmail: userEmail,
          passWord: this.passWord,
          tk: registrantToken,
          // tslint:disable-next-line:no-shadowed-variable
          success: (success: any) => {
            console.log(success);
            this.onResult.emit({
              isCancelled: true
            });
            this.bsModalRef.hide();
          },
          error: (error: any) => {
            console.log(error);
          }
        });
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }
}
