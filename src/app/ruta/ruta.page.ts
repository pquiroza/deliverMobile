import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as firebase from "firebase";

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument  } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MapsAPILoader, AgmMap } from '@agm/core';
import { GoogleMapsAPIWrapper } from '@agm/core/services';

import { Movilposicion } from '../movilposicion';
import { Pedidofinal } from '../pedidofinal';


@Component({
  selector: 'app-ruta',
  templateUrl: './ruta.page.html',
  styleUrls: ['./ruta.page.scss'],
})
export class RutaPage implements OnInit {
  idPedido: any;
  public movilLiveDoc: AngularFirestoreDocument<Movilposicion>;
  public pedidoDoc: AngularFirestoreDocument<Pedidofinal>;
  origin: any;
  destination: any;
  lat: any;
  lng:any;
  constructor(private afs: AngularFirestore, private router: Router, public route: ActivatedRoute, private geolocation: Geolocation) {





    firebase.auth().onAuthStateChanged(usuario => {
      if(usuario){
        this.route.queryParams.subscribe(params => {
          this.idPedido = params['idPedido'];
          this.geolocation.getCurrentPosition().then((pos) => {
              this.origin = { lat: pos.coords.latitude, lng: pos.coords.longitude}
              console.log(this.origin.lat,this.origin.lng);
              this.lat = pos.coords.latitude;
              this.lng = pos.coords.longitude;

              console.log(this.idPedido);
              this.pedidoDoc = this.afs.doc<Pedidofinal>('Pedido/'+this.idPedido);
              this.pedidoDoc.valueChanges().subscribe(pedido =>{
                console.log(pedido);
                this.destination = { lat: pedido.lat, lng: pedido.lng}
              })


          })

        })
      }
    })


   }

  ngOnInit() {
  }

}
