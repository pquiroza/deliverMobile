import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { IonicStorageModule } from '@ionic/storage';
import { RouterModule, RouteReuseStrategy } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AgmDirectionModule } from 'agm-direction';   // agm-direction

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';


import { LoginPage } from './login/login.page';
import { ListaproductosPage } from './listaproductos/listaproductos.page';
import * as firebase from 'firebase';



firebase.initializeApp(environment.firebase);
@NgModule({
  declarations: [AppComponent,
    LoginPage, ListaproductosPage
  ],
  entryComponents: [LoginPage, ListaproductosPage],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
     IonicStorageModule.forRoot(),
  AngularFireModule.initializeApp(environment.firebase),
  AngularFirestoreModule,
  AngularFireAuthModule,
  AngularFireStorageModule,
  AgmCoreModule.forRoot({
    apiKey: ''
  }),
  AgmDirectionModule
],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
