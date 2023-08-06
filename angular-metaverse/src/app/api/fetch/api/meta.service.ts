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
export class MetaService {

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

    public getMetaData(domain?: string, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public getMetaData(domain?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public getMetaData(domain?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public getMetaData(domain?: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        let headers = this.defaultHeaders;
        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'text/plain',
            'application/json',
            'text/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        return this.httpClient.get<any>(`${domain}`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    public getMetaByDomain(): Observable<any> {
        let options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        }
        const host = location.host;
        // const host = "test.multimeta.one";
        //     ['live.multimeta.one',
        //     'center.bdsggroup.com',
        //     'doi-moi-sang-tao.bdsggroup.com',
        //     'stall.bdsggroup.com',
        //     'dat-nen.bdsggroup.com',
        //     'tai-chinh.bdsggroup.com',
        //     'thuong-mai-dien-tu.bdsggroup.com',
        //     'chuyen-doi-so.bdsggroup.com',
        //     'doi-moi.bdsggroup.com',
        //     'uni-startup.bdsggroup.com']
        // const host = "bdsggroup.com";
        return this.httpClient.get<any>(`${this.basePath}/meta_verse/get_by_domain/?domain_name=${host}`,
            options
        );
    }

    public connectMeta(metaId: string, peerId: string): Observable<any> {
        const token: string | null = 'Bearer ' + localStorage.getItem('token');
        let options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
        }
        return this.httpClient.post<any>(`${this.basePath}/meta_player/`,
            JSON.stringify({name: peerId, meta_id: metaId, player_id: peerId}),
            options
        );
    }

    public disconnectMeta(peerId: string): Observable<any> {
        const token: string | null = 'Bearer ' + localStorage.getItem('token');
        let options = {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
        }
        return this.httpClient.put<any>(`${this.basePath}/meta_player/`,
            JSON.stringify({player_id: peerId}),
            options
        );
    }

    public getPlayers(metaId: string): Observable<any> {
        const token: string | null = 'Bearer ' + localStorage.getItem('token');
        let options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': token
            }
        }
        return this.httpClient.get<any>(`${this.basePath}/meta_player/?meta_id=${metaId}`,
            options
        );
    }

    public getModels3D(): Observable<any> {
        const token: string | null = 'Bearer ' + localStorage.getItem('token');
        let options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': token
            }
        }
        return this.httpClient.get<any>(`${this.basePath}/model_3d/`,
            options
        );
    }

    public getMetaVerse(): Observable<any> {
        const token: string | null = 'Bearer ' + localStorage.getItem('token');
        let options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': token
            }
        }
        return this.httpClient.get<any>(`${this.basePath}/meta_verse/`,
            options
        );
    }
}
