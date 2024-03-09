import { Injectable } from '@angular/core';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
import ThermalPrinterEncoder from 'thermal-printer-encoder';
import { Observable } from 'rxjs';
import { CommonService } from './common.service';

declare var navigator:any;

@Injectable({
  providedIn: 'root'
})
export class PrintService {
  encoder: any = new ThermalPrinterEncoder({
    language: 'esc-pos'
  });

  devices: any[] = [];
  
  imagePath = 'assets/images/icon.bmp';

  constructor(private bluetoothSerial: BluetoothSerial, private common: CommonService) { }

  searchBT(): Promise<void> {
    return this.bluetoothSerial.list();
  }

  isBTEnabled():Promise<any> {
    return this.bluetoothSerial.isEnabled();
  }

  enable():Promise<any> {
    return this.bluetoothSerial.enable();
  }

  async showBTSetting():Promise<any> {
    return await this.bluetoothSerial.showBluetoothSettings();
  }

  discover():Promise<any> {
    return this.bluetoothSerial.discoverUnpaired();
  }

  connect(macAddress: string): Observable<any> {    
      // Connect to the Bluetooth device using the MAC address
      return this.bluetoothSerial.connect(macAddress);
  }

  async printText(text: string, address:string): Promise<void> {
    var name = 'Avallix Test Print';
    var storeAddr = 'Somewhere';
    let img:any = new Image();
    img.src = 'assets/images/icon.bmp';
    var dateTime = new Date();
    let result = this.encoder
                  .initialize()
                  .align('center')
                  .image(img, 80, 80, 'atkinson') //logo centered
                  .newline()
                  .bold(true)
                  .size('normal')
                  .line(name) //Name of Buiness
                  .bold(false)
                  .size('small')
                  .line(storeAddr) //Address of business
                  .newline()
                  .size('normal')
                  .line('*************************')
                  .size('normal')
                  .bold(true)
                  .line('PURCHASE RECEIPT')
                  .bold(false)
                  .size('normal')
                  .line('Customer Copy')
                  .line('*************************')
                  .newline()
                  .align('left')
                  .text('Date/Time')
                  .align('right')
                  .text(dateTime)
                  .newline()
                  .align('left')
                  .text('WHID') //CASH REGISTER NAME
                  .align('right')
                  .text('Somewhere')
                  .newline()
                  .align('left')
                  .text('RGN') //CASH REGISTER NAME
                  .align('right')
                  .text('Register#1')
                  .newline()
                  .align('left')
                  .text('REF#') //CASH REGISTER NAME
                  .align('right')
                  .text('C2O-8754sd4')
                  .newline()
                  .align('center')
                  .text('*************************')
                  .newline()
                  .align('center')
                  .line(text)
                  .align('center')
                  .text('*************************')
                  .qrcode('https://yoursite.com')
                  .cut('full');

    const data = result.encode();
    this.testPrint(address,data);
  }

  testPrint(address:any, text:string) {
    let connSub = this.connect(address).subscribe(data => {
      this.bluetoothSerial.write(text).then(response => {
        this.common.toast('Printed successfully!','success');
        connSub.unsubscribe();
      },
      (err) => {
        this.common.toast('Error printing text: '+err?.message,'danger');
      });
      },
      (err) => {
        this.common.toast('Error connecting to printer: '+err?.message,'danger');
      });
  }

}
