import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServersModule } from './servers/servers.module';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { HttpErrorInterceptor } from './core/services/http/http-error-interceptor';
import { SearchModule } from './search/search.module';
import { SettingsModule } from './settings/settings.module';
import { RateLimitingHttpInterceptor } from './core/services/http/rate-limiting-http-interceptor';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,

        SharedModule,
        AppRoutingModule,
        ServersModule,
        SearchModule,
        SettingsModule
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: RateLimitingHttpInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
