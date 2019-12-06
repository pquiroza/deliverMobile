import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Client } from '../client';

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
  constructor(private afs: AngularFirestore, private router: Router) {}



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

}
