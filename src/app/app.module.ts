import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthGuard } from './guard/auth.guard';
import { HttpClientModule } from '@angular/common/http';
import { LoadingModule } from './shared/modules/loading/loading.module';
import { MenuComponent } from './shared/components/menu/menu.component';

@NgModule({
  declarations: [AppComponent,MenuComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,HttpClientModule,LoadingModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, AuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
