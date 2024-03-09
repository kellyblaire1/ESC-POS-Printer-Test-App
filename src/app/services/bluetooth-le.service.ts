import { Injectable } from '@angular/core';
import { BluetoothLE } from '@awesome-cordova-plugins/bluetooth-le/ngx';
// import { isPlatformCordova } from '@ionic/angular'; // or 'cordova-plugin-ionic' for Ionic applications

declare var window:any;
declare var uuids:any;

@Injectable({
  providedIn: 'root'
})
export class BluetoothLEService {

  bluetoothle:any =  new BluetoothLE();

  foundDevices:any = [];

  constructor() { }

  initializeBluetooth() {
    new Promise<void>((resolve) => {
      // Assuming 'bluetoothle' is available globally
      this.bluetoothle.initialize(resolve, { request: true, statusReceiver: false });
    }).then(this.initializeSuccess, this.handleError);
  }

  initializeSuccess(result: any): void {
    if (result.status === "enabled") {
      this.log("Bluetooth is enabled.");
      this.log(result);
    } else {
      // Assuming you have an element with id "start-scan" in your template
      const startScanButton = document.getElementById("start-scan") as HTMLButtonElement;
      if (startScanButton) {
        startScanButton.disabled = true;
      }

      this.log("Bluetooth is not enabled:", "status");
      this.log(result, "status");
    }
  }

  log(message: any, type?: string): void {
    // Implement your logging logic here
    console.log(message);
  }

  handleError(error: any): void {
    let msg: string;

    if (error.error && error.message) {
      const errorItems: string[] = [];

      if (error.service) {
        // errorItems.push("service: " + (uuids[error.service] || error.service));
      }

      if (error.characteristic) {
        // errorItems.push("characteristic: " + (uuids[error.characteristic] || error.characteristic));
      }

      msg = "Error on " + error.error + ": " + error.message + (errorItems.length && (" (" + errorItems.join(", ") + ")"));
    } else {
      msg = error;
    }

    this.log(msg, "error");

    if (error.error === "read" && error.service && error.characteristic) {
      this.reportValue(error.service, error.characteristic, "Error: " + error.message);
    }
  }

  startScan(): void {
    this.log("Starting scan for devices...", "status");

    // Assuming 'foundDevices' is a variable declared in your component or service
    this.foundDevices = [];

    // Assuming you have HTML elements with the IDs "devices", "services", and "output" in your template
    // document.getElementById("devices").innerHTML = "";
    // document.getElementById("services").innerHTML = "";
    // document.getElementById("output").innerHTML = "";

    if (window.cordova.platformId === "windows") {
      this.bluetoothle.retrieveConnected((result:any) => {
        this.log("retrieveConnectedSuccess()");
        this.log(result);

        result.forEach((device:any) => {

          this.addDevice(device.name, device.address);

        });
      }, (error:any) => this.handleError(error), {});
    } else {
      this.bluetoothle.startScan((result:any) => {
        this.log("startScanSuccess(" + result.status + ")");

        if (result.status === "scanStarted") {

          this.log("Scanning for devices (will continue to scan until you select a device)...", "status");
        }
        else if (result.status === "scanResult") {

          if (!this.foundDevices.some((device:any) => {

            return device.address === result.address;

          })) {

            this.log('FOUND DEVICE:');
            this.log(result);
            this.foundDevices.push(result);
            this.addDevice(result.name, result.address);
          }
        }
      }, (error:any) => this.handleError(error), { services: [] });
    }
  }

  addDevice(name:any, address:any) {

    var button:any = document.createElement('button');
    button.style.width = "100%";
    button.style.padding = "10px";
    button.style.fontSize = "16px";
    button.textContent = name + ": " + address;

    button.addEventListener("click", () => {

      // document?.getElementById('services').innerHTML = "";
      this.connect(address);
    });

    document?.getElementById('devices')?.appendChild(button);
  }

  connect(address:any) {

    this.log('Connecting to device: ' + address + "...", "status");

    if (window.cordova.platformId === "windows") {

      this.getDeviceServices(address);

    }
    else {

      this.stopScan();

      new Promise((resolve, reject) => {

        this.bluetoothle.connect(resolve, reject, { address: address });

      }).then((result:any)=>{
        this.log("- " + result.status);

        if (result.status === "connected") {

          this.getDeviceServices(result.address);
        }
        else if (result.status === "disconnected") {

          this.log("Disconnected from device: " + result.address, "status");
        }

      }, this.handleError);

    }
  }

  stopScan() {

    new Promise((resolve, reject) => {

      this.bluetoothle.stopScan(resolve, reject);

    }).then(() => {
      if (!this.foundDevices.length) {

        this.log("NO DEVICES FOUND");
      }
      else {

        this.log("Found " + this.foundDevices.length + " devices.", "status");
      }
    }, this.handleError);
  }

  getDeviceServices(address:any) {

    this.log("Getting device services...", "status");

    var platform = window.cordova.platformId;

    if (platform === "android") {

      new Promise((resolve, reject) => {

        this.bluetoothle.discover(resolve, reject,
          { address: address });

      }).then((result:any) => {

      }, this.handleError);

    }
    else if (platform === "windows") {

      new Promise((resolve, reject) => {

        this.bluetoothle.services(resolve, reject,
          { address: address });

      }).then((result) => {

      }, this.handleError);

    }
    else {

      this.log("Unsupported platform: '" + window.cordova.platformId + "'", "error");
    }
  }

  connectSuccess(result:any) {

    this.log("- " + result.status);

    if (result.status === "connected") {

        this.getDeviceServices(result.address);
    }
    else if (result.status === "disconnected") {

        this.log("Disconnected from device: " + result.address, "status");
    }
}

  discoverSuccess(result:any) {

    this.log("Discover returned with status: " + result.status);

    if (result.status === "discovered") {

      // Create a chain of read promises so we don't try to read a property until we've finished
      // reading the previous property.

      var readSequence = result.services.reduce((sequence:any, service:any) => {

        return sequence.then(() => {

          return this.addService(result.address, service.uuid, service.characteristics);
        });

      }, Promise.resolve());

      // Once we're done reading all the values, disconnect
      readSequence.then(() => {

        new Promise((resolve, reject) => {

          this.bluetoothle.disconnect(resolve, reject,
            { address: result.address });

        }).then(this.connectSuccess, this.handleError);

      });

    }
  }

  servicesSuccess(result:any) {

    this.log("servicesSuccess()");
    this.log(result);

    if (result.status === "services") {

      var readSequence = result.services.reduce((sequence:any, service:any) => {

        return sequence.then(() => {

          console.log('Executing promise for service: ' + service);

          new Promise((resolve, reject) => {

            this.bluetoothle.characteristics(resolve, reject,
              { address: result.address, service: service });

          }).then(this.characteristicsSuccess, this.handleError);

        }, this.handleError);

      }, Promise.resolve());

      // Once we're done reading all the values, disconnect
      readSequence.then(() => {

        new Promise((resolve, reject) => {

          this.bluetoothle.disconnect(resolve, reject,
            { address: result.address });

        }).then(this.connectSuccess, this.handleError);

      });
    }

    if (result.status === "services") {

      result.services.forEach((service:any) => {

        new Promise((resolve, reject) => {

          this.bluetoothle.characteristics(resolve, reject,
            { address: result.address, service: service });

        }).then(this.characteristicsSuccess, this.handleError);

      });

    }
  }

  characteristicsSuccess(result:any) {

    this.log("characteristicsSuccess()");
    this.log(result);

    if (result.status === "characteristics") {

      return this.addService(result.address, result.service, result.characteristics);
    }

    return;
  }

  addService(address:any, serviceUuid:any, characteristics:any) {

    this.log('Adding service ' + serviceUuid + '; characteristics:');
    this.log(characteristics);

    var readSequence = Promise.resolve();

    var wrapperDiv = document.createElement("div");
    wrapperDiv.className = "service-wrapper";

    var serviceDiv = document.createElement("div");
    serviceDiv.className = "service";
    serviceDiv.textContent = uuids[serviceUuid] || serviceUuid;
    wrapperDiv.appendChild(serviceDiv);

    characteristics.forEach((characteristic:any) => {

      var characteristicDiv = document.createElement("div");
      characteristicDiv.className = "characteristic";

      var characteristicNameSpan = document.createElement("span");
      characteristicNameSpan.textContent = (uuids[characteristic.uuid] || characteristic.uuid) + ":";
      characteristicDiv.appendChild(characteristicNameSpan);

      characteristicDiv.appendChild(document.createElement("br"));

      var characteristicValueSpan = document.createElement("span");
      characteristicValueSpan.id = serviceUuid + "." + characteristic.uuid;
      characteristicValueSpan.style.color = "blue";
      characteristicDiv.appendChild(characteristicValueSpan);

      wrapperDiv.appendChild(characteristicDiv);

      readSequence = readSequence.then(() => {

        return new Promise((resolve, reject) => {

          this.bluetoothle.read(resolve, reject,
            { address: address, service: serviceUuid, characteristic: characteristic.uuid });

        }).then(this.readSuccess, this.handleError);

      });
    });

    document.getElementById("services")?.appendChild(wrapperDiv);

    return readSequence;
  }

  readSuccess(result:any) {

    this.log("readSuccess():");
    this.log(result);

    if (result.status === "read") {

      this.reportValue(result.service, result.characteristic, window.atob(result.value));
    }
  }

  reportValue(serviceUuid:any, characteristicUuid:any, value:any) {
    var elId:any = document.getElementById(serviceUuid + "." + characteristicUuid);
    elId.textContent = value;
  }

}
