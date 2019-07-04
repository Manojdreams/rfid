import { Component } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { LoadingController, AlertController } from '@ionic/angular';
import { OneSignal } from '@ionic-native/onesignal/ngx';

@Component({
  selector: 'app-user-guide',
  templateUrl: 'user-guide.page.html',
  styleUrls: ['user-guide.page.scss'],
})
export class UserGuidePage {
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
  noAnnouncement = true;
  constructor(private http: HTTP,  public alertController: AlertController, public loadingController: LoadingController, private oneSignal: OneSignal) {
    this.category = 'announcement';
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    console.log(this.userInfo);
  }

  ngOnInit() {
  }
  
  
}
