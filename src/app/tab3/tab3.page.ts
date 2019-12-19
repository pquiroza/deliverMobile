import { Component } from '@angular/core';
import { Movilcarga } from '../movilcarga';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument  } from '@angular/fire/firestore';
import { Product } from '../product';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as firebase from "firebase";

export interface MovilcargaId extends Movilcarga {
    id: string;
}







@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
public cargaCollection: AngularFirestoreCollection<Movilcarga>;
carga: Observable<MovilcargaId[]>;
movil: any;

  constructor(public afs: AngularFirestore) {
    console.log("t3");
    firebase.auth().onAuthStateChanged(usuario => {
      if (usuario){
        console.log(usuario.uid)
        this.movil = usuario;
  this.cargaCollection = this.afs.collection<Movilcarga>('MovilCarga', ref => ref.where('idvehiculo','==',usuario.uid));
  this.carga = this.cargaCollection.snapshotChanges().pipe(map(actions => actions.map(a => {
    const data = a.payload.doc.data() as Movilcarga
    console.log(data)
    const id = a.payload.doc.id;
    return {id, ...data}
  })))
      }
    })



  }

}
