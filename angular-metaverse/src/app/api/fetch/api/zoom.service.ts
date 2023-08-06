import { Inject, Injectable, Optional } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { from, Observable } from 'rxjs';
import { BASE_PATH } from '../variables';
import { Configuration } from '../configuration';
import { environment } from '../../../../environments/environment';

@Injectable()
export class ZoomService {

    public defaultHeaders = new HttpHeaders();
    public configuration = new Configuration();
    protected basePath = environment.META_API_URL;

    constructor(protected httpClient: HttpClient, @Optional() @Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
        if (basePath) {
            this.basePath = basePath;
        }
        if (configuration) {
            this.configuration = configuration;
            this.basePath = basePath || configuration.basePath || this.basePath;
        }
    }

    public getZooms(): Observable<any> {
        const token: string | null = 'Bearer ' + localStorage.getItem('token');
        let options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': token
            }
        };
        return this.httpClient.get<any>(`${this.basePath}/zoom/`,
            options
        );
    }
}
