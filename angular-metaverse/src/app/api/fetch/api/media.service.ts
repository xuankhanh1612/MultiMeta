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
export class MediaService {

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

    public getMediaTypes(): Observable<any> {
        const token: string | null = 'Bearer ' + localStorage.getItem('token');
        let options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': token
            }
        }
        return this.httpClient.get<any>(`${this.basePath}/media/types/`,
            options
        );
    }

    public getMediaByMetaverse(typeId: number, metaverseId?: number): Observable<any> {
        const token: string | null = 'Bearer ' + localStorage.getItem('token');
        let path = `?type_id=${typeId}`;
        metaverseId ? path += `&metaverse_id=${metaverseId}` : ''
        let options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
        }        
        return this.httpClient.get<any>(`${this.basePath}/metaverse/medias/${path}`,
            options
        );
    }
}
