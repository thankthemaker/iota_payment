import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import QRCode from 'qrcode'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  qrImage = '';
  address = 'PCCARCHBFN9SPFYSHLTLCLTLPJSDDDDQIPTBGUZPEQLHDMQYBRC9FYFUNSNA9DKLKYN9R9KRGKMFHFMX9RWYYUDPKZ';

  constructor(public toastController: ToastController) {}

  ionViewDidEnter() {
    this.process();
    this.displayQrCode();
  }

  async presentToast() {
    this.process();
    const toast = await this.toastController.create({
      message: 'Your settings have been saved.',
      duration: 2000
    });
    toast.present();
  }

  displayQrCode() {
    return this.qrImage !== '';
  }

  process() {
    const qrcode = QRCode;
    const self = this;
    qrcode.toDataURL(self.address, { errorCorrectionLevel: 'H' }, function (err, url) {
      self.qrImage = url;
    })
  }
}
