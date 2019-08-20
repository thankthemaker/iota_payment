import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import QRCode from 'qrcode';
import { IotaApiService } from '../iotaApi.service';
import { isEqual } from 'lodash';

// For testing:
// const staticAddress ='HO9WEOIPSJZDYOMIROARQTEMQ9MGNGICWDPXZKBEXCCEU9W9HBYHXEEHVJHAZHKUUGAUGBJYUTTIUXC9XCOIUYRHPB';
const staticAddress = undefined;
const toast = false;

// the amount shoud be transfered by the coffee-machine
const amount = 3;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  qrImage = '';
  address = '';
  text = '';
  transactions = [];
  transactionTimer: any;

  constructor(public toastController: ToastController, public iotaApi: IotaApiService) {}

  ionViewDidEnter() {
    this.nextAdress();
    this.displayQrCode();
    this.getAddressData();
    this.transactionTimer = setInterval(() => {
      this.getAddressData()
    }, 10 * 1000);
  }

  async getAddressData() {
    if (this.address) {
      this.iotaApi.getAddressInfo(this.address).subscribe(addressData => {
        // prevents flickering on slow devices
        if (!isEqual(this.transactions, addressData.transactions)) {
          this.transactions = addressData.transactions;
        }
      })
    }

    if (toast) {
      const toast = await this.toastController.create({
        message: 'Transactions at address ' + this.address.substr(0, 20) + ': ' + this.transactions.length,
        duration: 2000
      });
      toast.present();
    }
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

  displayQrCode() {
    return this.qrImage !== '';
  }

  processQRCode() {
    const qrcode = QRCode;
    const self = this;
    qrcode.toDataURL(`{
      "address": "${self.address}",
      "amount": ${amount},
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
