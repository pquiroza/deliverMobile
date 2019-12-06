import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument  } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Client } from '../client';
import { map } from 'rxjs/operators';
import { Product } from '../product';
import { Carro } from '../carro';
import { Pedido } from '../pedido';
import { Pedidofinal } from '../pedidofinal';
import { Productospedido } from  '../productospedido';
import { ListaproductosPage } from '../listaproductos/listaproductos.page';

export interface CarroId extends Carro{
  id: string;
}
  export interface ProductId extends Product {
      id: string;
  }

@Component({
  selector: 'app-nuevopedido',
  templateUrl: './nuevopedido.page.html',
  styleUrls: ['./nuevopedido.page.scss'],
})
export class NuevopedidoPage implements OnInit {

  idcliente: any;
  public clientDoc: AngularFirestoreDocument<Client>;
  client: any
  private carroCollection: AngularFirestoreCollection<Carro>;
  productsCarro: Observable<CarroId[]>;
  private productsCollection: AngularFirestoreCollection<Product>;
  products: Observable<ProductId[]>;

    constructor(private afs: AngularFirestore, public route: ActivatedRoute, public modalController: ModalController) {

      this.client = [];

  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.idcliente = params['idcliente'];
      console.log(this.idcliente);
      this.clientDoc = this.afs.doc<Client>('Client/'+this.idcliente);
      this.clientDoc.snapshotChanges().subscribe(datos => {
        this.client = datos.payload.data();
        console.log(this.client);


        this.carroCollection = this.afs.collection<Carro>('Carro', ref => ref.where('idusuario','==',this.idcliente).where('estado','==',0));
        this.productsCarro = this.carroCollection.snapshotChanges().pipe(map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Carro;
          const id = a.payload.doc.id;
          return {id, ...data}
        })));

      })
    });



  }


  async agregarProducto(idcliente){
const modal = await this.modalController.create({
  component: ListaproductosPage,
  componentProps: {
    idcliente: this.client
  }
});
await modal.present();
  }


  finalizaPedido(cliente){
    console.log(cliente);
      var d = new Date();
      let pedidofinalCollection: AngularFirestoreCollection<Pedidofinal>;
      pedidofinalCollection = this.afs.collection<Pedidofinal>('Pedido');

      const idpf = this.afs.createId();
      const pcliente: Pedidofinal = {id: idpf, idcliente: cliente.id,nombre: cliente.nombre,apellido: cliente.apellido, calle: cliente.calle, numero: cliente.numero,extra: cliente.extra, comuna: cliente.comuna, callearray: cliente.callearray, estado: "Entregado", movil: "JRRB99", lat: cliente.lat, lng: cliente.lng, total: 1, fecha: Date.now(),year: d.getFullYear(), mes: d.getMonth()+1,dia:d.getDate(),hora:d.getHours()}
      pedidofinalCollection.doc(idpf).set(pcliente);
      let productosPedidoCollection: AngularFirestoreCollection<Productospedido>;
      productosPedidoCollection = this.afs.collection<Productospedido>('Productospedido');
      let productosCarroFinal: AngularFirestoreCollection<Carro>;
      let carros: Observable<CarroId[]>;
      productosCarroFinal = this.afs.collection<Carro>('Carro',ref => ref.where('idusuario','==',cliente.id).where('estado','==',0));


      var p1 = new Promise(
        (resolve,reject)  => {
          carros = productosCarroFinal.valueChanges();
          carros.subscribe(p => {
            resolve(p);
          })
        }

    );

    let total = 0;
    p1.then((val: Array<Carro>) => {
      val.forEach(data => {
        const pedidoProducto: Productospedido = { idpedido: idpf, idproducto: data.idproducto,nombreproducto: data.nombreproducto, cantidad: data.cantidad, precio: data.precio}
        productosPedidoCollection.add(pedidoProducto);
        total = total + (data.cantidad * data.precio);
        productosCarroFinal.doc(data.id).update({estado: 1});
      });
       //poner alerta Aca

       console.log(total);
       pedidofinalCollection.doc(idpf).update({total: total});

    });


  }

}
