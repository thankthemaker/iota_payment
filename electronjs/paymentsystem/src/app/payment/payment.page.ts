import { Component } from '@angular/core';
import QRCode from 'qrcode';
import { IotaApiService } from '../iotaApi.service';
import { isEmpty } from 'lodash';
import { Router } from '@angular/router';

// For testing:
//const staticAddress ='HO9WEOIPSJZDYOMIROARQTEMQ9MGNGICWDPXZKBEXCCEU9W9HBYHXEEHVJHAZHKUUGAUGBJYUTTIUXC9XCOIUYRHPB';
const staticAddress = undefined;
const refreshTransactionIntervalSeconds = 5;

@Component({
  selector: 'app-payment',
  templateUrl: 'payment.page.html',
  styleUrls: ['payment.page.scss'],
})
export class PaymentPage {
  qrImage = '';
  address = '';
  text = '';
  transactions = [];
  transactionTimer: any;
  // the amount shoud be transfered by the coffee-machine
  amount = 3;

  constructor(public iotaApi: IotaApiService, private router: Router) {}

  ionViewDidEnter() {
    this.nextAdress();
    this.displayQrCode();
    this.transactionTimer = setInterval(() => {
      this.getAddressData()
    }, refreshTransactionIntervalSeconds * 1000);
  }

  ngOnDestroy() {
    this.qrImage = '';
    this.address = '';
    this.transactions = [];
    this.transactionTimer = undefined;
  }

  nextAdress() {
    staticAddress ? this.address = staticAddress :
    this.iotaApi.getNewAddress().subscribe(data => {
      console.log('New address [' + data.index + ']: ' + data.address);
      if (typeof data.address === "string") {
        this.address = data.address;
        this.processQRCode();
      }
    })
  }

  async getAddressData() {
    if (this.address) {
      this.iotaApi.getAddressInfo(this.address).subscribe(addressData => {
        if (!isEmpty(addressData.transactions)) {
          // check amount-value on all transactions on an address
          const receivedAmount = addressData.transactions.reduce((a, b) => a + b.value, 0);
          if (receivedAmount >= this.amount) {
            this.router.navigate(['/brewing'])
          }
        }
      })
    }
  }

  displayQrCode() {
    return this.qrImage !== '';
  }

  processQRCode() {
    const qrcode = QRCode;
    const self = this;
    qrcode.toDataURL(`{
      "address": "${self.address}",
      "amount": ${self.amount},
      "message": "",
      "tag": ""
    }`, {
      errorCorrectionLevel: 'H',
      colorDark : "#00357a",
      colorLight : "#fecb0a",
     }, function (err, url) {
      self.qrImage = url;
    })
  }
}
