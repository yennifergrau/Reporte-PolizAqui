import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ComponentsComponent } from '../../components/components/components.component';
import { MenuComponent } from '../../components/menu/menu.component';



@NgModule({

  declarations: [
    ComponentsComponent,
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports:[
    ComponentsComponent,
  ]
})
export class LoadingModule { }
