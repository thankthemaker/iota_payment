import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { BalanceinfoComponent } from './balanceinfo.component';
import { IotaPipeModule } from '../helpers/transformValue/IotaPipe.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IotaPipeModule
  ],
  exports: [
      BalanceinfoComponent
  ],
  declarations: [BalanceinfoComponent]
})
export class BalanceinfoModule {}
