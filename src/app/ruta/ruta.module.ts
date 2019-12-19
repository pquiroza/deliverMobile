import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';   // agm-direction

import { IonicModule } from '@ionic/angular';

import { RutaPage } from './ruta.page';

const routes: Routes = [
  {
    path: '',
    component: RutaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgmCoreModule,
    AgmDirectionModule,

    RouterModule.forChild(routes)
  ],
  declarations: [RutaPage]
})
export class RutaPageModule {}
