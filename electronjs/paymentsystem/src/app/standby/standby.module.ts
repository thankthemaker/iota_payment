import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { StandbyComponent } from './standby.component';
import { TransactionsComponent } from '../transactions/transactions.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: StandbyComponent
      }
    ])
  ],
  declarations: [StandbyComponent, TransactionsComponent]
})
export class StandbyModule {}
