import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { TransitionVisualizationComponent } from './transition-visualization.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BrowserAnimationsModule,
  ],
  exports: [
    TransitionVisualizationComponent
  ],
  declarations: [TransitionVisualizationComponent]
})
export class TransitionVisualizationModule {}
