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


export interface ProductospedidoId extends Productospedido {
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

  constructor(private afs: AngularFirestore, private router: Router, public route: ActivatedRoute, public alertController: AlertController) {
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
    console.log("Cancelado");
    this.router.navigate(['/']);
  })




    }




  actualizaStock(idPedido){

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
