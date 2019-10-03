import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { StandbyComponent } from './standby.component';
import { NodeinfoComponent } from '../nodeinfo/nodeinfo.component';
import { MarketdataComponent } from '../marketdata/marketdata.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: StandbyComponent,
      },
    ]),
  ],
  exports: [
    NodeinfoComponent,
  ],
  declarations: [StandbyComponent, NodeinfoComponent, MarketdataComponent],
})
export class StandbyModule {}
