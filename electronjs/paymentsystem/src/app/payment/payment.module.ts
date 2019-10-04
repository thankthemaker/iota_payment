import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PaymentPage } from './payment.page';
import { ThousandSuffixesPipe } from './iotaPipe';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: PaymentPage
      }
    ])
  ],
  declarations: [PaymentPage,ThousandSuffixesPipe]
})
export class PaymentModule {}
