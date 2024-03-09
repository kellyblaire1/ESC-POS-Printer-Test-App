import { Component } from '@angular/core';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  
  constructor(private androidPermissions: AndroidPermissions) { 
    this.handlePermission();
  }
  
  handlePermission() {
    const list: any = [
      this.androidPermissions.PERMISSION.BLUETOOTH,
      this.androidPermissions.PERMISSION.BLUETOOTH_ADMIN,
      this.androidPermissions.PERMISSION.BLUETOOTH_SCAN,
      this.androidPermissions.PERMISSION.BLUETOOTH_ADVERTISE,
      this.androidPermissions.PERMISSION.BLUETOOTH_CONNECT,
      this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION
    ];
    
    list.forEach((permission:any) => {  
      this.androidPermissions.checkPermission(permission).then((result:any) => {
        // console.log('Has permission?', result.hasPermission)
        if(!result.hasPermission) {
          this.androidPermissions.requestPermission(permission);
        }
      },
      (err:any) => {
        this.androidPermissions.requestPermission(permission);
      });
    })
    // this.androidPermissions.requestPermissions(list);`
  }
}
