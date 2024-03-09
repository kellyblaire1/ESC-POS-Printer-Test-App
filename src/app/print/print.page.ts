import { Component, OnInit } from '@angular/core';
import { PrintService } from '../services/print.service';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-print',
  templateUrl: './print.page.html',
  styleUrls: ['./print.page.scss'],
})
export class PrintPage implements OnInit {

  devices: any[] = [];
  discovered: any[] = [];
  isEnabled!:any;
  macAddr:any = "";

  content = "";

constructor(
    private bluetoothService: PrintService,
    private common: CommonService,
  ) { }

  ngOnInit() {
    try {
      this.listBluetoothDevices();
    } catch(err) {}
  }

  printData() {
    // Print data
      const contentToPrint = 'Hello, Bluetooth Printer!\n\n';
      this.bluetoothService.printText(contentToPrint, this.macAddr);
  }

  async printTest() {
    // Print data
      this.macAddr = this.macAddr=="" ? localStorage.getItem('macAddr') : this.macAddr;
      // await this.bluetoothService.testPrint(this.macAddr, this.content);
      this.bluetoothService.printText(this.content, this.macAddr);
  }

  async connect(event:any) {
    try {
      const value = event.target.value;
      console.log('selected:',value);
      // // Replace '00:11:22:33:44:55' with the actual MAC address of your Bluetooth printer
      this.macAddr = value;
      localStorage.setItem('macAddr',this.macAddr);
      // // Connect to the Bluetooth printer
      await this.bluetoothService.connect(this.macAddr).subscribe(res => {
        // alert(JSON.stringify(res));
        this.common.toast('Connected Successfully!','success');
      });
    } catch(err:any) {
      // alert(err);
      this.common.toast(err.message,'danger');
    }
  }

  listBluetoothDevices() {
    try {
      this.bluetoothService.searchBT().then((data:any) => {
        this.discovered = data;
      },(err) => {
        this.common.toast('Something went wrong.'+err,'danger');
      });
    } catch (error) {
      this.common.toast('Error listing Bluetooth devices:'+error,'danger');
    }
  }

  async discoverDevices() {
    this.common.toast('Fetching available devices...','primary');
    await this.bluetoothService.discover().then((result:any[]) => {
      if(result.length > 0) {
        this.discovered = result;
      } else {
        this.listBluetoothDevices();
      }
      this.common.toast(this.discovered.length+' devices listed.','success');
    });
  }

  enable() {
    this.bluetoothService.enable().then(data => {
      this.isEnabled = data;
      this.common.toast('Enabled successfully!','success');
    });
  }

}
