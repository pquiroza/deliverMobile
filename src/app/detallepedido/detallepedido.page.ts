import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';


import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument  } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MapsAPILoader, AgmMap } from '@agm/core';
import { GoogleMapsAPIWrapper } from '@agm/core/services';

import { Pedidofinal } from '../pedidofinal';
import { Productospedido } from '../productospedido';
import { Movilcarga } from '../movilcarga';
import * as firebase from "firebase";

export interface ProductospedidoId extends Productospedido {
    id: string;
}

export interface MovilcargaId extends Movilcarga{
  id: string;
}

@Component({
  selector: 'app-detallepedido',
  templateUrl: './detallepedido.page.html',
  styleUrls: ['./detallepedido.page.scss'],
})
export class DetallepedidoPage implements OnInit {


  public pedidoDocument: AngularFirestoreDocument<Pedidofinal>;
  public productosCollection: AngularFirestoreCollection<Productospedido>;
  productosPedido: Observable<ProductospedidoId[]>;

  idPedido: any;
  pedido: any;
  movil: any;

  constructor(private afs: AngularFirestore, private router: Router, public route: ActivatedRoute, public alertController: AlertController) {


    firebase.auth().onAuthStateChanged(usuario => {
      if (usuario){
        this.movil = usuario;
      }
    })




    this.pedido = {id:"",nombre: "",apellido: "",calle: "",numero: "",extra: "", total:""}
    this.route.queryParams.subscribe(params => {
      this.idPedido = params['idPedido'];
      console.log(this.idPedido);
      this.pedidoDocument = this.afs.doc<Pedidofinal>('Pedido/'+this.idPedido);
      this.pedidoDocument.valueChanges().subscribe(pedido => {
        this.pedido = pedido;
        console.log(this.pedido);
      });


      this.productosCollection = this.afs.collection<Productospedido>('ProductosPedido',ref => ref.where('idpedido','==',this.idPedido));
      this.productosPedido = this.productosCollection.snapshotChanges().pipe(map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Productospedido;
        const id = a.payload.doc.id;
        console.log(data);
        return {id, ...data}
      })));


      this.productosPedido.forEach(p => {
        console.log(p);
      })

    });




  }


  async  entregaPedido(id){
      const alert = await this.alertController.create({
        header: 'Exito',
        subHeader: 'Pedido Entregado',
        message: 'El pedido ha sido entregado',
        buttons:[{
          text:'Ok',
          cssClass: 'success'
        }]
      })
  await alert.present();
  let result = await alert.onDidDismiss().then(r => {
    let pedidoCollection: AngularFirestoreCollection<Pedidofinal>;
    pedidoCollection = this.afs.collection<Pedidofinal>('Pedido');
    pedidoCollection.doc(id).update({estado:'Entregado'});
    this.actualizaStock(id);
    this.router.navigate(['/']);
  })




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
        console.log(this.movil.uid);
        cargaMovilCollection = this.afs.collection<Movilcarga>('MovilCarga',ref => ref.where('idproducto','==',data.idproducto).where('idvehiculo','==',this.movil.uid));


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


    async cancelaPedido(id) {
      const alert = await this.alertController.create({
        header: 'Cancelar Pedido',
        subHeader: 'Pedido',
        message: 'El Pedido ha sido cancelado',
        buttons: [{
          text:'Cancelar Pedido',
          cssClass: 'danger',
          handler: (c) => {
            let pedidoCollection: AngularFirestoreCollection<Pedidofinal>;
            pedidoCollection = this.afs.collection<Pedidofinal>('Pedido');
            pedidoCollection.doc(id).update({estado:'Cancelado'});
            console.log("Cancelado");
            this.router.navigate(['/']);
          }
        },{
          text:'Volver',
          role: 'cancel',
          handler: () => {
            console.log('Volver');
          }
        }]
      });

      await alert.present();
    }

  ngOnInit() {
  }

}
