import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import * as Sentry from "@sentry/browser";
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

const baseUrl = 'https://iota-api.thank-the-maker.org';
// const baseUrl = 'http://localhost:3000';

const options = {
    headers: {
        'x-api-key': 'CiZ9mapceb5pQXFsvNx1q4mHqYrZVWN8SScTzrzc'
    }
};

@Injectable()
export class IotaApiService {
    constructor(private http: HttpClient) {
    }

    payThirdparty = address => this.http.post<any>(baseUrl + '/addresses' + '/' + address + '/paythirdparty', null, options).pipe(catchError(error => IotaApiService.log(error)));

    getNewAddress = () => this.http.post<any>(baseUrl + '/addresses', {seedId: 1}, options).pipe(catchError(error => IotaApiService.log(error)));

    getAddressInfo = address => this.http.get<any>(baseUrl + '/addresses' + '/' + address, options).pipe(catchError(error => IotaApiService.log(error)));

    getSeedInfo = () => this.http.get<any>(baseUrl + '/seeds' + '/' + '1', options).pipe(catchError(error => IotaApiService.log(error)));

    getNodeInfo = () => this.http.get<any>(baseUrl + '/nodes', options).pipe(catchError(error => IotaApiService.log(error)));

    getIotaFromEur = eurs => this.http.get<any>(baseUrl + '/market/price-conversion/EUR/' + eurs, options).pipe(catchError(error => IotaApiService.log(error)));

    getIotaQuotes = () => this.http.get<any>(baseUrl + '/market/iota/quotes', options).pipe(catchError(error => IotaApiService.log(error)));

    private static log(error: HttpErrorResponse): Observable<HttpErrorResponse> {
        Sentry.setExtra('Api-Error', error);
        Sentry.setTag('Type', 'Api-Error');
        Sentry.captureException(new Error(error.message));
        return throwError(error);
    }
}
