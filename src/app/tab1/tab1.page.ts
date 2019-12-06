import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from "firebase";


import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument  } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MapsAPILoader, AgmMap } from '@agm/core';
import { GoogleMapsAPIWrapper } from '@agm/core/services';

import { Pedidofinal } from '../pedidofinal';
import { Movil } from '../movil';

import { ModalController } from '@ionic/angular';
import { LoginPage } from '../login/login.page';



export interface PedidofinalId extends Pedidofinal{
  id: string;
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  public pedidosCollection: AngularFirestoreCollection<Pedidofinal>;
  pedidos: Observable<PedidofinalId[]>;

  public movilDoc: AngularFirestoreDocument<Movil>;

  movil: any;

  constructor(private afs: AngularFirestore, private router: Router, public modalController: ModalController) {






    firebase.auth().onAuthStateChanged(usuario => {
      console.log(usuario);
      if(!usuario){
        this.presentModal();

      }
      else{

        console.log(usuario.uid);
         this.movilDoc = this.afs.doc<Movil>('Movil/'+usuario.uid);
         this.movilDoc.valueChanges().subscribe(p => {
            this.movil = p;
            this.pedidosCollection = afs.collection<Pedidofinal>('Pedido',ref => ref.where('estado','==','Ingresado').where('movil','==',this.movil.patente));
            this.pedidos = this.pedidosCollection.snapshotChanges().pipe(map(actions => actions.map(a => {
              const data = a.payload.doc.data();
              const id = a.payload.doc.id;
              return {id, ...data}
            })))
         })


      }
    })





  }



  async presentModal(){
    const modal = await this.modalController.create({
      component: LoginPage
    });
     await modal.present();
     let datos = await modal.onWillDismiss();
     console.log(datos);
  }

  detallePedido(id){
    console.log(id);
    this.router.navigate(['/detallepedido'],{queryParams:{idPedido:id}});

  }

}
