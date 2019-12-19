import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Client } from '../client';
import {  AlertController } from '@ionic/angular';

import { MapsAPILoader, AgmMap } from '@agm/core';
import { GoogleMapsAPIWrapper } from '@agm/core/services';

declare var google: any;


interface Marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}

interface Location {
  lat: number;
  lng: number;
  viewport?: Object;
  zoom: number;
  address_level_1?:string;
  address_level_2?: string;
  address_country?: string;
  address_zip?: string;
  address_state?: string;
  marker?: Marker;
}



export interface ClientId extends Client {
    id: string;
}




@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  private clientsCollection: AngularFirestoreCollection<Client>;
  clients: Observable<ClientId[]>;
geocoder: any;
  constructor(private afs: AngularFirestore, private router: Router,public mapsApiLoader: MapsAPILoader, public alert: AlertController) {
    this.mapsApiLoader.load().then(() => {
      this.geocoder = new google.maps.Geocoder();
    })


  }



  buscarDireccion(direccion: string){
    this.clientsCollection = this.afs.collection<Client>('Client',ref => {
      return ref.where('callearray','array-contains',direccion);
    });


  this.clients = this.clientsCollection.snapshotChanges().pipe(map(actions => actions.map(a => {
    const data = a.payload.doc.data() as Client;
    const id = a.payload.doc.id;
    console.log(a.payload.doc.data());
    return { id, ...data };
  })))


  this.clients.forEach(function(hu){
    console.log(hu)

} )

  }

  ventaCliente(id){
    this.router.navigate(['/nuevopedido'],{queryParams:{idcliente:id}});

  }


  guardaCliente(nombre,apellido,rut,telefono, email,calle,numero,extra,comuna){
    let lat = 0;
    let lng = 0;
    calle = calle.toLowerCase();
    extra = extra.toLowerCase();
    let extraarray = extra.split(" ");
    let callearray = calle.split(" ");
    callearray.push(numero);
    extraarray.forEach(e => {
      callearray.push(e);
    })

    console.log(callearray);
    console.log(calle,numero, comuna)
    this.findcoordinates(calle+" "+numero+" "+comuna+" Santiago , Chile",this.geocoder,(results) => {
      console.log(results);
      console.log(results[0].geometry.location.lat());
      console.log(results[0].geometry.location.lng());
      lat = results[0].geometry.location.lat();
      lng = results[0].geometry.location.lng();
      const id = this.afs.createId();
      const  clientsCollection: AngularFirestoreCollection<Client> = this.afs.collection<Client>('Client');
      const client: Client ={id,nombre,apellido,rut,telefono,calle,numero,extra,comuna,callearray,lat: lat,lng: lng};
      clientsCollection.doc(id).set(client);

      this.muestraAlerta();
      this.router.navigate(['']);

    })
  }

async muestraAlerta(){
  const alerta = await this.alert.create({
    header:'Nuevo Cliente Ingresado',
      subHeader: 'Nuevo Cliente',
      message: 'Nuevo cliente ingresado exitosamente',
      buttons: ['OK']
  });
  await alerta.present();

}
  findcoordinates(direccion,geocoder,callback){
 console.log(direccion);

   geocoder.geocode({
     'address': direccion
   }, (results, status) => {

     if (status == google.maps.GeocoderStatus.OK){
       console.log(results[0].geometry.location);
       callback(results);

     }
     else{
       console.log(status);
       console.log("pal pico");
       callback(null);
     }
   }
 )




 }


}
