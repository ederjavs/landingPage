import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CustomMaterialModule } from "@core/shared/custom-material.module";
import {GoogleMapsModule} from '@angular/google-maps'; 
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { MusicProvider } from "@core/providers/music.provider";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    CustomMaterialModule.forRoot(),
    HttpClientModule,
    GoogleMapsModule,
    ScrollToModule.forRoot()
  ],
  providers: [MusicProvider],
  bootstrap: [AppComponent]
})
export class AppModule { }
