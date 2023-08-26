import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loading: HTMLIonLoadingElement | null = null;

  constructor(private loadingCtrl: LoadingController) {}

  private async initLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Getting geolocation data...'
    });

    this.loading = loading;
  }

  async present() {
    await this.initLoading();
    await this.loading!.present()
  }

  async dismiss() {
    if (this.loading) {
      await this.loading.dismiss();
      this.loading = null;
    }
  }
}
