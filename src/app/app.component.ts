import { Component } from '@angular/core';

import { Platform, AlertController, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { LoadingService } from './home/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'List',
      url: '/list',
      icon: 'list'
    },
    {
      title: 'Login',
      url: '/login',
      icon: 'list'
    },
  ];
  login = false;

  public userInfo: any = {};
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public router: Router,
    private http: HTTP,
    private oneSignal: OneSignal,
    public alertController: AlertController,
    public loading: LoadingService,
    public menuCtrl: MenuController,
  ) {
    this.initializeApp();

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString('#2A388F');
      this.splashScreen.hide();
      if (localStorage.getItem("login")) {
        console.log("home")
        this.login = true;
        this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
        this.router.navigateByUrl('/home');
      }
      else {
        this.login = false;
        console.log("home")
        this.router.navigateByUrl('/login');
      }
    });

    this.oneSignal.startInit('969df786-b9ce-40ff-9895-c09317b5b212', '798936048747');

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);

    this.oneSignal.handleNotificationReceived().subscribe(() => {
      // do something when notification is received
    });

    this.oneSignal.handleNotificationOpened().subscribe(() => {
      // do something when a notification is opened
    });
    this.oneSignal.endInit();
    this.oneSignal.getIds().then(token => {
      localStorage.setItem('onesignal_token', JSON.stringify(token))
      console.log(token);
    });
  }

  async logout() {
    this.menuCtrl.close();
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'You want to logout?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          handler: () => {
            var token = JSON.parse(localStorage.getItem('onesignal_token'));
            var user_token = token.userId;
            var user_info = JSON.parse(localStorage.getItem('userInfo'));
            var user_reference = user_info.logger_id
            this.loading.present();
            var data = {
              logger_id: user_reference,
              device_id: user_token
            }
            this.http.post('http://webbundyclock.com/RFIC_notification/api/unset_deviceid', data, {})
              // this.http.post('http://172.16.1.164/rfid/api/unset_deviceid', data, {})
              .then(data => {
                var resp = JSON.parse(data.data);
                console.log(resp.message)
                if (resp.message == "Device Removed successfully") {
                  localStorage.removeItem('login')
                  this.router.navigateByUrl('/login');
                }
                console.log(data.status);
                console.log(data.data); // data received by server
                console.log(data.headers);
                this.loading.dismiss();
                if (resp.message == "Invalid referencekey") {
                  localStorage.removeItem('login')
                  this.router.navigateByUrl('/login');
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
        }
      ]
    });
    await alert.present();
  }

  async presentAlert(msg) {
    const alert = await this.alertController.create({
      header: 'RFID',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }
  home() {
    this.menuCtrl.close();
    this.router.navigateByUrl('/home');
  }

  closeMenu() {
    this.menuCtrl.close();
  }

  menuOpened() {
    console.log("xabh")
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    if (localStorage.getItem("login")) {
      this.login = true;
    }
    else {
      this.login = false;
    }
  }

  loginPage() {
    this.menuCtrl.close();
    this.router.navigateByUrl('/login');
  }
  userGuide(){
    this.menuCtrl.close();
    this.router.navigateByUrl('/user-guide');
  }

  setDefaultPic() {
    this.menuCtrl.close();
    this.userInfo.client_logo = "assets/images/user.jpg";
    console.log(this.userInfo)
  }
}
