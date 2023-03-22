import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { IndexPageComponent } from './index-page/index-page.component';
import { ShopPageComponent } from './shop-page/shop-page.component';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';

import { TagCommanderService } from 'ngx-tag-commander';

import { WindowRef } from 'ngx-tag-commander';

import { NgxTagCommanderModule } from 'ngx-tag-commander';


const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
    data: {
      tcInclude: [{
        idc:  12,
        ids: 4056,
        options: {
          exclusions: ['datastorage', 'deduplication'],
          events: { page: [{}, {}]},
        }
      }]
    }
  },
  {
    path: 'home',
    component: IndexPageComponent,
    data: {
      tcInclude: [{
        idc:  12,
        ids: 4056,
        options: {
          exclusions: ['datastorage', 'deduplication'],
          events: { page: [{}, {}]},
        }
      }]
    }
  },
  {
    path: 'shop',
    component: ShopPageComponent,
    data: {
      tcInclude: [{
        idc:  12,
        ids: 4056,
        options: {
          exclusions: ['datastorage', 'deduplication'],
          events: { page: [{}, {}]},
        }
      }]
    }
  },
  {
    path: 'dashboard',
    component: DashboardPageComponent,
    data: {
      tcInclude: [{
        'idc':  12,
        'ids': 4056,
        options: {
          exclusions: ['datastorage', 'deduplication'],
          events: { page: [{}, {}]},
        }
      }]
    }
  }
];

@NgModule({
  declarations: [
    AppComponent,
    IndexPageComponent,
    ShopPageComponent,
    DashboardPageComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes, { relativeLinkResolution: 'legacy' }),
    BrowserModule,
    AppRoutingModule,
    NgxTagCommanderModule
  ],
  providers: [WindowRef],
  bootstrap: [AppComponent]
})





export class AppModule {
  constructor(tcService: TagCommanderService) {
    tcService.setDebug(true);
    tcService.trackRoutes(true);
    tcService.addContainer('container_body', '/assets/tag-commander-body.js', 'body');
    tcService.addContainer('container_head', '/assets/tag-commander-head.js', 'head');
    // tcService.reloadAllContainers({})
  }
}
