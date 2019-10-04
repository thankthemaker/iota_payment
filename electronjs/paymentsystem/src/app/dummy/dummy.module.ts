import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { DummyComponent } from './dummy.component';
import { MarketdataComponent } from '../marketdata/marketdata.component';
import { NodeinfoComponent } from '../nodeinfo/nodeinfo.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: DummyComponent
      }
    ])
  ],
  declarations: [DummyComponent, NodeinfoComponent, MarketdataComponent]
})
export class DummyModule {}
