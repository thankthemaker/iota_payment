import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import QRCode from 'qrcode';
import { composeAPI } from '@iota/core'

const iota = composeAPI({
  // replace with your IRI node address 
  // or connect to a Devnet node for testing: 'https://nodes.devnet.iota.org:443'
  provider: 'https://iri.thank-the-maker.org'
})


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  qrImage = '';
  
  seed = 'REPLACE999WITH999YOUR999SEED'
  address = ''

  text = '';
  balance: number = 0;
  myIndex: number = 20;
  transCount = 0;
  transactionTimer: any;
  balanceTimer: any;

  constructor(public toastController: ToastController) {}

  ionViewDidEnter() {
    this.nextAdress();
    this.processQRCode();
    this.displayQrCode();
    this.getAccountData()
    this.findTransactions()
    this.transactionTimer = setInterval(() => {
      this.findTransactions()
    }, 10 * 1000);
    this.balanceTimer = setInterval(() => {
      this.getAccountData()
    }, 60 * 1000);
  }

  async getAccountData() {
    const options = {
      index: this.myIndex,
      security: 2,
      checksum: true,
    };
    iota.getAccountData(this.seed, options).then(accountData => {
      console.log('Balance:' + accountData.balance)
      this.balance=accountData.balance / 1000000.00;
//      this.text = JSON.stringify(inputs)
    })
    .catch(err => {
        console.log(`Request error: ${err.message}`)
    }) 
  }

  async findTransactions() {
    this.processQRCode(); 

    iota.findTransactions({ addresses: [this.address] }).then(hashes => {
      console.log('Transactions:' + hashes)
      this.transCount = hashes.length;
    })
    .catch(err => {
      console.log(`Request error: ${err.message}`)
    })

    const toast = await this.toastController.create({
      message: 'Transactions at address ' + this.address.substr(0, 20) + ': '  + this.transCount,
      duration: 2000
    });
    toast.present();
  }

  nextAdress() {
   this.myIndex++
   const options = {
      index: this.myIndex,
      security: 2,
      checksum: true,
  };
    iota.getNewAddress(this.seed, options).then(address => {
      console.log('New address [' + this.myIndex + ']: ' + address)
      this.address = address;
    })
    .catch(err => {
      console.log(`Request error: ${err.message}`)
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
