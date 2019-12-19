import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument  } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as firebase from "firebase";


import { Movil } from '../movil';
import { Movilposicion } from '../movilposicion';


@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  public movilDoc: AngularFirestoreDocument<Movil>;
  public movilCollection: AngularFirestoreCollection<Movil>;
  public movilLiveCollecion: AngularFirestoreCollection<Movilposicion>;
  movil: any;
  movilid: any;

  constructor(public afs: AngularFirestore) {
    this.movilCollection = this.afs.collection<Movil>('Movil');
    this.movilLiveCollecion = this.afs.collection<Movilposicion>('MovilLive');
    this.movil = [];
    firebase.auth().onAuthStateChanged(usuario => {
      if (usuario){
        this.movilDoc = this.afs.doc<Movil>('Movil/'+usuario.uid);
        this.movilDoc.valueChanges().subscribe(m => {
          this.movil = m;

        })
      }
    })

   }

  ngOnInit() {
  }
cambiaDisponibilidad(event){
  console.log(event)
  if (event){
      this.movilCollection.doc(this.movil.id).update({estado: "Activo"})
      this.movilLiveCollecion.doc(this.movil.id).update({estado: "Activo"})
  }
  else{
    this.movilCollection.doc(this.movil.id).update({estado: "Inactivo"})
    this.movilLiveCollecion.doc(this.movil.id).update({estado: "Inactivo"})
  }
}
}
