import { Component } from '@angular/core';

import { Platform, AlertController, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { OneSignal } from '@ionic-native/onesignal/ngx';

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

  public userInfo:any={};
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public router : Router,
    private oneSignal: OneSignal,
    public alertController :AlertController,
    public menuCtrl  : MenuController,
  ) {
    this.initializeApp();
   
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString('#7C72FF');
      this.splashScreen.hide();
      if (localStorage.getItem("login")) {
        console.log("home")
        this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
        this.router.navigateByUrl('/home');
      }
      else{
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
      localStorage.setItem('onesignal_token',JSON.stringify(token))
      console.log(token);
    });
  }

   async logout(){
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
            localStorage.clear();
            this.router.navigateByUrl('/login');
          }
        }
      ]
    });
     await alert.present();
  }
  home(){
    this.menuCtrl.close();
    this.router.navigateByUrl('/home');
  }
  closeMenu(){
    this.menuCtrl.close();
  }

  menuOpened(){
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
  }
}
