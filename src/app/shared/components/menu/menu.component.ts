import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent  {

  constructor(private router : Router, private navCtrl : NavController) { }
  selectedTab: number = 0;

  selectTab(index: number) {
    this.selectedTab = index;
  }

  exitNavigate(){
    this.navCtrl.navigateRoot('/')
  }
  ngOnInit( ) {}

  isActive(tab: string) {
    return this.router.url === '/' + tab;
  }
}
