import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import QRCode from 'qrcode';
import { IotaApiService } from '../iotaApi.service';

// For testing:
// const staticAddress ='HO9WEOIPSJZDYOMIROARQTEMQ9MGNGICWDPXZKBEXCCEU9W9HBYHXEEHVJHAZHKUUGAUGBJYUTTIUXC9XCOIUYRHPB';
const staticAddress = undefined;
const toast = false;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  qrImage = '';
  address = '';
  text = '';
  balance: number;
  transactions = [];
  transactionTimer: any;
  balanceTimer: any;

  constructor(public toastController: ToastController, public iotaApi: IotaApiService) {}

  ionViewDidEnter() {
    this.nextAdress();
    this.processQRCode();
    this.displayQrCode();
    this.getAccountData();
    this.getAddressData();
    this.transactionTimer = setInterval(() => {
      this.getAddressData()
    }, 10 * 1000);
    this.balanceTimer = setInterval(() => {
      this.getAccountData()
    }, 120 * 1000);
  }

  async getAccountData() {
    this.iotaApi.getSeedInfo().subscribe(seedInfo => {
      this.balance = seedInfo.balance;
    })
  }

  async getAddressData() {
    if (this.address) {
      await this.iotaApi.getAddressInfo(this.address).subscribe(addressData => {
        this.transactions = addressData.transactions;
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
    qrcode.toDataURL(self.address, {
      errorCorrectionLevel: 'H',
      colorDark : "#00357a",
      colorLight : "#fecb0a",
     }, function (err, url) {
      self.qrImage = url;
    })
  }
}
