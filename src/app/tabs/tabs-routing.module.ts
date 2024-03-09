import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'devices',
        loadChildren: () => import('./../devices/devices.module').then( m => m.DevicesPageModule)
      },
      {
        path: 'print',
        loadChildren: () => import('./../print/print.module').then( m => m.PrintPageModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('./../settings/settings.module').then( m => m.SettingsPageModule)
      },
      {
        path: '',
        redirectTo: 'devices',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
