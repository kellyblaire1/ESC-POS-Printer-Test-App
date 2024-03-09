import { Component, OnInit } from '@angular/core';
import { PrintService } from '../services/print.service';

@Component({
  selector: 'app-printer',
  templateUrl: './printer.page.html',
  styleUrls: ['./printer.page.scss'],
})
export class PrinterPage implements OnInit  {

  devices: any[] = [];
  discovered: any[] = [];
  isEnabled!:any;
  macAddr:string = "";

  constructor(
    private bluetoothService: PrintService,
  ) { }

  ngOnInit() {
    try {
      const msg = 'Print Page';
      console.log(msg);
    } catch(err) {}
  }

  printData() {
    // Print data
      const contentToPrint = 'Hello, Bluetooth Printer!\n\n';
      this.bluetoothService.printText(contentToPrint, this.macAddr);
  }

  printTest() {
    // Print data
      const contentToPrint = 'Hello, Bluetooth Printer!\n\n';
      this.bluetoothService.testPrint(this.macAddr, contentToPrint);
  }

  connect(macAddr:any) {
    try {
      // Replace '00:11:22:33:44:55' with the actual MAC address of your Bluetooth printer
      this.macAddr = macAddr;
      // Connect to the Bluetooth printer
      this.bluetoothService.connect(this.macAddr).subscribe(res => {
        alert(JSON.stringify(res));
      });
    } catch(err) {
      alert(err);
    }
  }

  listBluetoothDevices() {
    try {
      this.bluetoothService.searchBT().then((data:any) => {
        this.devices = data;
      },(err) => {
        alert('Something went wrong.'+err);
      });
    } catch (error) {
      console.error('Error listing Bluetooth devices:', error);
    }
  }

  discoverDevices() {
    this.bluetoothService.discover().then(result => {
      this.discovered = result;
    })
  }

  enable() {
    this.bluetoothService.enable().then(data => {
      this.isEnabled = data;
    });
  }
}
