import { Component } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { LoadingController, AlertController } from '@ionic/angular';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { LoadingService } from './loading.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  category: any;
  userInfo: any = {};
  initial = true;
  search_key = '';
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

  announcements: any = [];
  logs: any = [];
  noLog = true;
  searchText: any;
   date = '10:39';

  noAnnouncement = true;
  constructor(private http: HTTP, public loading: LoadingService, public alertController: AlertController, public loadingController: LoadingController, private oneSignal: OneSignal) {
    this.category = 'announcement';
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    console.log(this.userInfo);
    this.getAnnouncements();
    this.getLogs();
    console.log(new Date())
    console.log(new Date(this.date))
  }

  ngOnInit() {
  }
  segmentChanged(ev: any) {
    console.log(ev)
    this.category = ev.detail.value;
    if (this.category == 'log') {
      this.getLogs();
    }
    else {
      this.getAnnouncements();
    }

  }

  isEnabled(value: string): boolean {
    return this.category == value;
  }

  search(q: string) {
    this.search_key = q;
    if (this.category == 'log') {
      this.getLogs();
    }
    else {
      this.getAnnouncements();
    }
  }

  doRefresh(event) {
    this.searchText = "";
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

  onCancel(event){
    if (this.category == 'log') {
      this.getLogs();
    }
    else {
      this.getAnnouncements();
    }
  }

  getLogs() {
    var data;
    if (this.search_key != '') {
      data = {
        referencekey: this.userInfo.referencekey,
        search_key: this.search_key
      }
    }
    else {
      data = {
        referencekey: this.userInfo.referencekey
      }
    }

    console.log(data)
    this.http.post('http://webbundyclock.com/RFIC_notification/api/logs', data, {})
    // this.http.post('http://172.16.1.164/rfid/api/logs', data, {})
      .then(data => {
        console.log(data)
        var resp = JSON.parse(data.data);
        if (resp.status == "success" && resp.message == "OK") {
          this.logs = resp.data.logs_details;
          console.log(this.logs)
          if (this.logs.length == 0) {
            this.noLog = true;
          }
          else {
            this.noLog = false;
          }
        }
        if (resp.message == "No logs found"){
          this.presentAlert(resp.message)
        }
        
        if (this.search_key != '') {
          this.search_key = '';
        }
      })
      .catch(error => {
        if (this.search_key != '') {
          this.search_key = '';
        }
        this.presentAlert('Server error');
      });
  }

  getAnnouncements() {
    var data;
    if (this.search_key != '') {
      data = {
        referencekey: this.userInfo.referencekey,
        search_key: this.search_key
      }
    }
    else {
      data = {
        referencekey: this.userInfo.referencekey
      }
    }
    if (this.initial) {
      this.loading.present();
    }
    console.log(data)
    this.http.post('http://webbundyclock.com/RFIC_notification/api/announcement', data, {})
    // this.http.post('http://172.16.1.164/rfid/api/announcement', data, {})
      .then(data => {
        var resp = JSON.parse(data.data);
        console.log(resp)
        if (resp.message == "No logs found") {
          this.presentAlert(resp.message)
        }
        if (resp.status == "success" && resp.message == "OK") {
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
       
        if (this.search_key != '') {
          this.search_key = '';
        }
      })
      .catch(error => {
        if (this.initial) {
          this.loading.dismiss();
        }
        if (this.search_key != '') {
          this.search_key = '';
        }
        this.initial = false;
        this.presentAlert('Server error');
      });
  }

  async presentAlert(msg) {
    const alert = await this.alertController.create({
      header: 'RFID',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

   setDefaultPic() {
    this.userInfo.client_logo = "assets/images/user.jpg";
  }
}
