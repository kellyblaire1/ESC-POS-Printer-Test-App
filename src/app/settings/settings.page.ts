import { Component, OnInit } from '@angular/core';
import { PrintService } from '../services/print.service';
// import { Event } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  status = false;
  macAddr:any = "0";

  constructor(
    private printServ: PrintService
  ) { }

  ngOnInit() {
    try {
      this.macAddr = localStorage.getItem('macAddr');
      this.checkBTStatus();

    } catch(err:any) {
      console.log(err.message);
    }
  }

  async checkBTStatus() {
    const status = await this.printServ.isBTEnabled();

    if(status) {
      this.status = true;
    } else {
      this.status = false;
    }
  }

  async settings() {
    await this.printServ.showBTSetting();
  }

  async changeStatus(event: any) {
    const ev = event.detail.checked;

    console.log('Evt',ev)
  }

}
