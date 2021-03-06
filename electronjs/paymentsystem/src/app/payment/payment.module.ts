import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PaymentPage } from './payment.page';
import { IotaPipeModule } from '../helpers/transformValue/IotaPipe.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IotaPipeModule,
    RouterModule.forChild([
      {
        path: '',
        component: PaymentPage
      }
    ])
  ],
  declarations: [PaymentPage]
})
export class PaymentModule {}
