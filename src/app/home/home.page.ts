import { Component } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { LoadingController } from '@ionic/angular';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { LoadingService } from './loading.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  category: any;
  userInfo: any ={};
  initial = true;
  data = {
    "items": [
      {
        "id": 1,
        "title": "Easy Carrot Cake",
        "time": "TODAY AT 2:20PM",
        "image": "assets/images/background/1.jpg"
      },
      {
        "id": 2,
        "title": "Lake Ladoga",
        "time": "TODAY AT 1:30PM",
        "image": "assets/images/background/2.jpg"
      },
      {
        "id": 3,
        "title": "Vasco da Gama Bridge",
        "time": "TODAY AT 14:20PM",
        "image": "assets/images/background/3.jpg"
      },
      {
        "id": 4,
        "title": "Cactus Flowers",
        "time": "TODAY AT 15:15PM",
        "image": "assets/images/background/4.jpg"
      },
      {
        "id": 4,
        "title": "Cactus Flowers",
        "time": "TODAY AT 15:15PM",
        "image": "assets/images/background/4.jpg"
      },
      {
        "id": 4,
        "title": "Cactus Flowers",
        "time": "TODAY AT 15:15PM",
        "image": "assets/images/background/4.jpg"
      },
      {
        "id": 4,
        "title": "Cactus Flowers",
        "time": "TODAY AT 15:15PM",
        "image": "assets/images/background/4.jpg"
      }
    ]
  };

  announcements:any=[];
  logs: any=[];
  noLog =true;
  noAnnouncement = true;
  constructor(private http: HTTP, public loading: LoadingService,public loadingController: LoadingController, private oneSignal: OneSignal) {
    this.category = 'announcement';
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    console.log(this.userInfo);
    this.getAnnouncements();
    this.getLogs();
  }

  ngOnInit(){
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
  segmentChanged(ev: any) {
    console.log(ev)
    this.category = ev.detail.value;
    if(this.category == 'log'){
      this.getLogs();
    }
    else{
      this.getAnnouncements();
    }
  }

  isEnabled(value: string): boolean {
    return this.category == value;
  }

  doRefresh(event){
    if (this.category == 'log') {
      this.getLogs();
    }
    else {
      this.getAnnouncements();
    }
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  getLogs(){
    var data={
      referencekey: this.userInfo.referencekey
    }
    
     console.log(data)
    this.http.post('http://dreamguys.co.in/demo/rfid/api/logs', data, {})
      .then(data => {
        console.log(data)
        var resp = JSON.parse(data.data);
        if (resp.status == "success") {
          this.logs = resp.data.logs_details;
          console.log(this.logs)
          if (this.logs.length == 0) {
            this.noLog = true;
          }
          else {
            this.noLog = false;
          }
        }
        console.log(data.status);
        console.log(data.data); // data received by server
        console.log(data.headers);
      })
      .catch(error => {
        console.log(error.status);
        console.log(error.error); // error message as string
        console.log(error.headers);
      });
  }

  getAnnouncements() {
    var data = {
      referencekey: this.userInfo.referencekey
    }
    if (this.initial) {
      this.loading.present();
    }
    console.log(data)
    this.http.post('http://dreamguys.co.in/demo/rfid/api/announcement', data, {})
      .then(data => {
        var resp = JSON.parse(data.data);
        console.log(resp)
        if (resp.status == "success") {
          this.announcements = resp.data.announcement_details;
          console.log(this.announcements)
          if (this.announcements.length == 0) {
            this.noAnnouncement = true;
          }
          else {
            this.noAnnouncement = false;
          }
        }
         if (this.initial) {
           this.loading.dismiss();
        }
        this.initial = false;
        console.log(data.status);
        console.log(data.data); // data received by server
        console.log(data.headers);
      })
      .catch(error => {
        if (this.initial) {
          this.loading.dismiss();
        }
        this.initial = false;
        console.log(error.status);
        console.log(error.error); // error message as string
        console.log(error.headers);
      });
  }
}
