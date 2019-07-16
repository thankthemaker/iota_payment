import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const baseUrl = 'https://iota-api.thank-the-maker.org';

@Injectable()
export class IotaApiService {
    constructor(private http: HttpClient) {
    }

    getNewAddress() {
        return this.http.post<any>(baseUrl + '/addresses', null);
    }

    getAddressInfo(address) {
        return this.http.get<any>(baseUrl+ '/addresses' + '/' + address)
    }

    getSeedInfo() {
        return this.http.get<any>(baseUrl+ '/seeds' + '/' + '1')
    }
}
