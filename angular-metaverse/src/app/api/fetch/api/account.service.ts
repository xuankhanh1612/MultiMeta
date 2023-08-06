import { Inject, Injectable, Optional } from '@angular/core';
import {
    HttpClient, HttpHeaders, HttpParams,
    HttpResponse, HttpEvent
} from '@angular/common/http';
import { CustomHttpUrlEncodingCodec } from '../encoder';

import { Observable } from 'rxjs';
import { BASE_PATH } from '../variables';
import { Configuration } from '../configuration';
import { environment } from '../../../../environments/environment';
import { from } from 'rxjs';

@Injectable()
export class AccountService {

    protected basePath = environment.META_API_URL;
    public defaultHeaders = new HttpHeaders();
    public configuration = new Configuration();

    constructor(protected httpClient: HttpClient, @Optional() @Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
        if (basePath) {
            this.basePath = basePath;
        }
        if (configuration) {
            this.configuration = configuration;
            this.basePath = basePath || configuration.basePath || this.basePath;
        }
    }

    public getToken(params: {email: string, password: string}): Observable<any> {
        let options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }
        return this.httpClient.post<any>(`${this.basePath}/token/`,
            params,
            options
        );
    }

    public signup(params: {email: string, password: string}): Observable<any> {
        let options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }
        return this.httpClient.post<any>(`${this.basePath}/user/sigup`,
            params,
            options
        );
    }

    public getUserInfo(): Observable<any> {
        const token: string | null = 'Bearer ' + localStorage.getItem('token');
        let options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': token
            }
        }
        return this.httpClient.get<any>(`${this.basePath}/user/get_info`,
            options
        );
    }

    public updateUserInfo(userId: number, formData: FormData): Observable<any> {
        const token: string | null = 'Bearer ' + localStorage.getItem('token');
        var myHeaders = new Headers();
        myHeaders.append("Authorization", token);
        var requestOptions: any = {
            method: 'PUT',
            headers: myHeaders,
            body: formData,
            redirect: 'follow'
        };
        return from(fetch(`${this.basePath}/user/${userId}/`, requestOptions))
    }

    public sendMailVerify(email: string, metaverseId: number): Observable<any> {
        let options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }
        const params = {email: email};
        return this.httpClient.post<any>(`${this.basePath}/metaverse/${metaverseId}/user/verify-mails/`,
            params,
            options
        );
    }

    public verifyMail(tokenVerify: string, code: string): Observable<any> {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        let raw = JSON.stringify({
            "verification_code": parseInt(code)
        });
        let requestOptions: any = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        return from(fetch(`${this.basePath}/token/verify-mail/${tokenVerify}/`, requestOptions))
    }

    public forgotPassword(email: string): Observable<any> {
        let options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }
        const params = {email: email};
        return this.httpClient.post<any>(`${this.basePath}/token/forgot-password/`,
            params,
            options
        );
    }
}
