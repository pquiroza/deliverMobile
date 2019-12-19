import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, AlertController } from '@ionic/angular';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument  } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Client } from '../client';
import { map } from 'rxjs/operators';
import { Product } from '../product';
import { Carro } from '../carro';
import { Pedido } from '../pedido';
import { Pedidofinal } from '../pedidofinal';
import { Productospedido } from  '../productospedido';
import { Movilcarga } from '../movilcarga';
import { ListaproductosPage } from '../listaproductos/listaproductos.page';
import { Movil } from '../movil';
import * as firebase from "firebase";



export interface CarroId extends Carro{
  id: string;
}
  export interface ProductId extends Product {
      id: string;
  }
  export interface ProductospedidoId extends Productospedido {
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
  public movilDoc: AngularFirestoreDocument<Movil>;
  movil: any;
  movil2: any;
    constructor(public router: Router, private afs: AngularFirestore, public route: ActivatedRoute, public modalController: ModalController, public alert: AlertController) {

      this.client = [];
      firebase.auth().onAuthStateChanged(usuario => {
        if (usuario){
          this.movil2 = usuario;

        }
      })


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

    firebase.auth().onAuthStateChanged(usuario => {
      if (usuario){

        this.movilDoc = this.afs.doc<Movil>('Movil/'+usuario.uid);
        this.movilDoc.snapshotChanges().subscribe(datos => {
          this.movil = datos.payload.data();
        })
      }
    })



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
      const pcliente: Pedidofinal = {id: idpf, idcliente: cliente.id,nombre: cliente.nombre,apellido: cliente.apellido, calle: cliente.calle, numero: cliente.numero,extra: cliente.extra, comuna: cliente.comuna, callearray: cliente.callearray, estado: "Entregado", movil: this.movil.patente, lat: cliente.lat, lng: cliente.lng, total: 1, fecha: Date.now(),year: d.getFullYear(), mes: d.getMonth()+1,dia:d.getDate(),hora:d.getHours()}
      pedidofinalCollection.doc(idpf).set(pcliente);
      let productosPedidoCollection: AngularFirestoreCollection<Productospedido>;
      productosPedidoCollection = this.afs.collection<Productospedido>('ProductosPedido');
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
        const idpp = this.afs.createId();
        const pedidoProducto: Productospedido = {id: idpp, idpedido: idpf, idproducto: data.idproducto,nombreproducto: data.nombreproducto, cantidad: data.cantidad, precio: data.precio}
        productosPedidoCollection.add(pedidoProducto);
        total = total + (data.cantidad * data.precio);
        productosCarroFinal.doc(data.id).update({estado: 1});
      });


       console.log(total);
       pedidofinalCollection.doc(idpf).update({total: total});

    });

    this.actualizaStock(idpf);
     this.presentaAlerta();
  }





   async presentaAlerta(){
     const alerta = await this.alert.create({
       header: 'Pedido Finalizado',
       subHeader: 'Entregado',
       message: 'El pedido ha sido finalizado',
       buttons: ['OK']

     });
     await alerta.present();
     this.router.navigate(['/']);
   }



  actualizaStock(idPedido){
    let productosPedidoCollection: AngularFirestoreCollection<Productospedido>;
    productosPedidoCollection = this.afs.collection<Productospedido>('ProductosPedido', ref => ref.where('idpedido','==',idPedido));
    let prod: Observable<ProductospedidoId[]>;
    let cargaMovilCollection: AngularFirestoreCollection<Movilcarga>;


    let resta = 0;
    let idp = 0;
    var p1 = new Promise((resolve,reject) => {
      prod = productosPedidoCollection.valueChanges();

      prod.subscribe(p => {
        resolve(p);
        console.log(p);
      })
    });
    p1.then((val: Array<Productospedido>) => {
      val.forEach(data => {
        console.log(data);
        console.log(idPedido);

        cargaMovilCollection = this.afs.collection<Movilcarga>('MovilCarga',ref => ref.where('idproducto','==',data.idproducto).where('idvehiculo','==',this.movil2.uid));


      var p2 = new Promise((resolve, reject) => {
      let cargap =  cargaMovilCollection.valueChanges();
      cargap.subscribe (d => {
        resolve(d);
      })
    });
    p2.then(val => {

      cargaMovilCollection.doc(val[0].id).update({cantidad: val[0].cantidad - data.cantidad})

    });

      })
    })

  }

}
