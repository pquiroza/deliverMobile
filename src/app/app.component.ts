import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { interval } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument  } from '@angular/fire/firestore';
import { Movilposicion } from './movilposicion';
import { Movil } from './movil';
import * as firebase from "firebase";


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  private timer;
  movil: any;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private geolocation: Geolocation,
    public afs: AngularFirestore
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      const source = interval(10000);

      const subscribe = source.subscribe(val => {
        this.geolocation.getCurrentPosition().then((resp) => {
          firebase.auth().onAuthStateChanged(usuario => {
            if (usuario){
                let movilDoc: AngularFirestoreDocument<Movil>;
                movilDoc = this.afs.doc<Movil>('Movil/'+usuario.uid);
                movilDoc.snapshotChanges().subscribe(datos => {
                  this.movil = datos.payload.data();
                  let posicionCollection: AngularFirestoreCollection<Movilposicion>;
                  posicionCollection = this.afs.collection<Movilposicion>('MovilPosicion');
                  let posicion: Movilposicion = {hora: Date.now(),idvehiculo:this.movil.id,lat:resp.coords.latitude,lng:resp.coords.longitude,patente:this.movil.patente}
                  let movilLive: AngularFirestoreCollection<Movilposicion>;
                  movilLive = this.afs.collection<Movilposicion>('MovilLive');
                  let posilive: Movilposicion = {hora: Date.now(),idvehiculo:this.movil.id,lat:resp.coords.latitude,lng:resp.coords.longitude,patente:this.movil.patente}
                  posicionCollection.add(posicion);
                  movilLive.doc(this.movil.id).update({hora:Date.now(),lat:resp.coords.latitude,lng: resp.coords.longitude});
                  console.log(Date.now());
                  console.log(resp.coords.latitude)
                  console.log(resp.coords.longitude)
                })
              }
                });


          })

      })




      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }



}
