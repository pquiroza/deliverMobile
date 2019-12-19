  import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, AlertController } from '@ionic/angular';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument  } from '@angular/fire/firestore';
import { Product } from '../product';
import { Carro } from '../carro';
import { Pedido } from '../pedido';
import { Client } from '../client';
import { Pedidofinal } from '../pedidofinal';
import { Movilcarga } from '../movilcarga';
import { Productospedido } from  '../productospedido';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
export interface MovilcargaId extends Movilcarga {
    id: string;
}


@Component({
  selector: 'app-listaproductos',
  templateUrl: './listaproductos.page.html',
  styleUrls: ['./listaproductos.page.scss'],
})
export class ListaproductosPage implements OnInit {
  private productsCollection: AngularFirestoreCollection<Movilcarga>;
  products: Observable<MovilcargaId[]>;
  public productDoc: AngularFirestoreDocument<Product>;
  public clientDoc: AngularFirestoreDocument<Client>;
  public carroCollection: AngularFirestoreCollection<Carro>;
  seleccionado: any;
  cliente: any;
  idcliente;
  constructor(private afs: AngularFirestore, public modalController: ModalController, public alert: AlertController) {

    this.carroCollection = this.afs.collection<Carro>('Carro');

    this.productsCollection = this.afs.collection<Movilcarga>('MovilCarga');
    this.products = this.productsCollection.snapshotChanges().pipe(map(actions => actions.map(a => {
      const data = a.payload.doc.data() as Movilcarga;
      const id = a.payload.doc.id;
      return {id, ...data}
    })));

   }


   closeModal(){
     this.modalController.dismiss();
   }

   selecciona(event){
     console.log(event.detail.value);
     this.productDoc = this.afs.doc<Product>('Producto/'+event.detail.value);
     this.productDoc.snapshotChanges().subscribe(p => {

       this.seleccionado = p.payload.data();
     })
   }


   async agregaProducto(id,cantidad,idcliente){
     console.log(id);
     console.log(cantidad);
     console.log(idcliente);
     const idcarro = this.afs.createId();
     const carro: Carro = {id: idcarro, idusuario: idcliente.id,nombreCliente: idcliente.nombre,apellidoCliente: idcliente.apellido,direccion: idcliente.calle+" "+idcliente.numero+" "+idcliente.extra,comuna: idcliente.comuna, lat: idcliente.lat,lng: idcliente.lng, idproducto: id.id,nombreproducto: id.nombreProducto,precio: id.precio, cantidad: cantidad, fecha: Date.now(), estado:0}
     this.carroCollection.doc(idcarro).set(carro);


     const alerta = await this.alert.create({
       header: 'Producto Ingresado',
       subHeader: 'Ingresado',
       message: 'El producto ha sido ingresado',
       buttons: ['OK']
     });
     await alerta.present();
     this.modalController.dismiss();

     /*
     this.clienteDoc = this.afs.doc<Client>('Client/'+idcliente);
     this.clienteDoc.snapshotChanges().subscribe(c => {
       this.cliente = c.payload.data();
     });
*/

   }

  ngOnInit() {

    console.log(this.idcliente);
  }

}
