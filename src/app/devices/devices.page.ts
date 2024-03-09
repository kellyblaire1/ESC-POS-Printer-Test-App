import { Component, OnInit } from '@angular/core';
import { PrintService } from '../services/print.service';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.page.html',
  styleUrls: ['./devices.page.scss'],
})
export class DevicesPage implements OnInit {

  devices: any[] = [];
  discovered: any[] = [];
  isEnabled!:any;
  macAddr:string = "";

  constructor(
    private bluetoothService: PrintService,
    private common: CommonService,
  ) { }

  ngOnInit() {
    this.listBluetoothDevices();
  }

  async listBluetoothDevices() {
    try {
      await this.bluetoothService.searchBT().then((data:any) => {
        this.devices = data;
      },(err) => {
        this.common.toast('Something went wrong: '+ err.message,'danger');
      });
    } catch (error:any) {
      this.common.toast('Error listing Bluetooth devices:'+error.message,'danger');
    }
  }

  async connect(macAddr:any) {
    try {
      // Replace '00:11:22:33:44:55' with the actual MAC address of your Bluetooth printer
      this.macAddr = macAddr;
      
      await this.bluetoothService.connect(this.macAddr).subscribe(res => {
        const storeMacAddr = localStorage.setItem('macAddr',this.macAddr);
        // alert(JSON.stringify(res));
        this.common.toast('Connnected successfully!','success');
      });
    } catch(err:any) {
      this.common.toast(err.message,'danger');
    }
  }

  async discoverDevices() {
    await this.bluetoothService.discover().then(result => {
      this.discovered = result;
    })
  }

}
