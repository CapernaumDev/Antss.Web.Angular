import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthenticationInterceptor } from '@core/authentication.interceptor';
import { ErrorInterceptor } from '@core/error.interceptor';
import { AppComponent } from './app.component';
import { AppStartup } from './core/app.startup';
import { CoreModule } from './core/core.module';
import { PublicModule } from './public/public.module';
import { PrivateModule } from './private/private.module';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { Effects } from '@core/store/effects';
import { Reducers } from '@core/store/reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { CacheRouteReuseStrategy } from './core/cache-route-reuse-strategy ';
import { metaReducers } from './core/store/logger-metareducer';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    RouterModule,
    HttpClientModule,
    CoreModule,
    PublicModule,
    PrivateModule,
    StoreModule.forRoot({ }),
    StoreModule.forFeature('app', Reducers, { metaReducers }),
    EffectsModule.forRoot([Effects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production
    })
  ],
  providers: [
    { provide: APP_INITIALIZER, multi: true, deps: [AppStartup], useFactory: (startupClass: AppStartup) => () => startupClass.startup() },
    { provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { 
      provide: RouteReuseStrategy,
      useClass: CacheRouteReuseStrategy
    }
  ],
  bootstrap: [AppComponent]
})

export class AppModule { 
}
