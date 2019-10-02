import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { StandbyComponent } from './standby.component';
import { NodeinfoComponent } from '../nodeinfo/nodeinfo.component';

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
  declarations: [StandbyComponent, NodeinfoComponent]
})
export class StandbyModule {}
