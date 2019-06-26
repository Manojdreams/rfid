import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HTTP } from '@ionic-native/http/ngx';
import { MenuController, AlertController } from '@ionic/angular';
import { LoadingService } from '../home/loading.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage {
  reference: string = '';
  constructor(private router: Router, public alertController:AlertController, private http: HTTP, public menuCtrl: MenuController, public loading: LoadingService) {
    this.menuCtrl.swipeEnable(false);
    // this.menuCtrl.
  }

  ngOnInit() {

  }
  signIn(){
    if (this.reference!=''){
      this.loading.present();
      var data = {
        referencekey : this.reference
      }
      this.http.post('http://dreamguys.co.in/demo/rfid/api/login', data, {})
        .then(data => {
          var resp = JSON.parse(data.data);
          console.log(resp.message)
          if (resp.message == "Logged in successfully"){
            localStorage.setItem("userInfo", JSON.stringify(resp.data.user_details));
            localStorage.setItem("login", 'true');
            this.router.navigateByUrl('/home');
          }
          console.log(data.status);
          console.log(data.data); // data received by server
          console.log(data.headers);
          this.loading.dismiss();
          if (resp.message == "Invalid referencekey"){
            this.presentAlert(resp.message);
          }
        })
        .catch(error => {
          console.log(error.status);
          console.log(error.error); // error message as string
          console.log(error.headers);
          this.loading.dismiss();
        });
    }
    else{
      this.presentAlert('Enter the reference key to continue');
        }
  }

  async presentAlert(msg) {
    const alert = await this.alertController.create({
      header: 'RFID',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }
}
