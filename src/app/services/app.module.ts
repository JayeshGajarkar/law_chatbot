import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ProfileModule } from './modules/feature_modules/profile/profile.module';
import { HomeModule } from './home/home.module';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { FormsModule } from '@angular/forms';
import { TokenInterceptorService } from './interceptors/token-interceptor.service';
import { HttpErrorInterceptorService } from './interceptors/http-error-interceptor.service';
import { GlobalErrorHandlerService } from './modules/core_modules/services/global-event-handler.service';
import { SharedModule } from './modules/core_modules/shared/shared.module';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ProfileModule,
    SharedModule,
    RippleModule,
    ToastModule,
    FormsModule,
    HomeModule
  ],
  
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimationsAsync(),
    providePrimeNG({
        theme: {
            preset: Aura
        }
    }),
    
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptorService,
      multi: true
    },
    { 
      provide: ErrorHandler,
      useClass: GlobalErrorHandlerService,
    },
    MessageService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
