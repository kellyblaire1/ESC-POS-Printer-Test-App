import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    private toastCtrl: ToastController
  ) { }

  async toast(message:string, type:string) {
    const toast = await this.toastCtrl.create({
      message: message,
      color: type,
      duration: 5000,
      positionAnchor: "footer",
      animated: true,
      buttons: ['Ok']
    });

    await this.dismissActiveToast();
    await toast.present();
  }

  async dismissActiveToast() {
    const toast = await this.toastCtrl.getTop();
    await toast?.dismiss();
  }
}
