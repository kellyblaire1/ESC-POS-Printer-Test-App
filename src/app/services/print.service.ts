import { Injectable } from '@angular/core';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
import ThermalPrinterEncoder from 'thermal-printer-encoder';
import { Observable } from 'rxjs';

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

  constructor(private bluetoothSerial: BluetoothSerial) { }

  searchBT(): Promise<void> {
    return this.bluetoothSerial.list();
  }

  enable():Promise<any> {
    return this.bluetoothSerial.enable();
  }

  discover():Promise<any> {
    return this.bluetoothSerial.discoverUnpaired();
  }

  connect(macAddress: string): Observable<any> {    
      // Connect to the Bluetooth device using the MAC address
      return this.bluetoothSerial.connect(macAddress);
  }

  async printText(text: string, address:string): Promise<void> {
    var name = 'Meticulous Triangle';
    var storeAddr = 'Somewhere in Abeokuta';
    let img:any = new Image();
    img.src = 'assets/images/icon.bmp';
    var dateTime = '01/01/2024, 11:45 AM';
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
                  .text('*************************')
                  .newline()
                  .size('normal')
                  .bold(true)
                  .text('PURCHASE RECEIPT')
                  .bold(false)
                  .size('normal')
                  .line('Customer Copy')
                  .newline()
                  .text('*************************')
                  .newline()
                  .align('left')
                  .text('Date/Time')
                  .align('right')
                  .text(dateTime)
                  .newline()
                  .align('left')
                  .text('WHID') //CASH REGISTER NAME
                  .align('right')
                  .text('Abeokuta')
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
                  .qrcode('https://meticuloustriangle.com.ng')
                  .cut('full');

    const data = result.encode();
    this.testPrint(address,data);
  }

  testPrint(address:any, text:string) {
    let connSub = this.connect(address).subscribe(data => {
      this.bluetoothSerial.write(text).then(response => {
        alert('Printed successfully!');
        connSub.unsubscribe();
      },
      (err) => {
        alert('Error printing text.');
      });
      },
      (err) => {
        alert('Error connecting to printer!');
      });
  }

}
