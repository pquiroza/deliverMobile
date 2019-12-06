import { Component, OnInit } from '@angular/core';
import * as firebase from "firebase";
import { ModalController } from '@ionic/angular';



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(public modalController: ModalController) { }

  ngOnInit() {
  }



login(patente: string,password:string){
  console.log(patente);
  var email = patente+"@gmail.com";
  firebase.auth().signInWithEmailAndPassword(email,password).then(user => {
    firebase.auth().onAuthStateChanged(usuario => {
      if (usuario){
        this.modalController.dismiss({usuario:usuario});
      }
    })
  }).catch(err => {
    console.log(err);
  })
}
}
