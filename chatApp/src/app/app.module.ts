import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { ChatInboxComponent } from './componenets/chat-inbox/chat-inbox.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './componenets/login/login.component';
import { AuthService } from './services/auth.service';
import { AuthGuardService } from './guard/chat-guard';

@NgModule({
  declarations: [AppComponent, ChatInboxComponent, LoginComponent],
  imports: [BrowserModule, FormsModule, AppRoutingModule],
  providers: [AuthGuardService, AuthService],
  bootstrap: [AppComponent],
})
export class AppModule {}
