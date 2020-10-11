import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatInboxComponent } from './componenets/chat-inbox/chat-inbox.component';
import { LoginComponent } from './componenets/login/login.component';
import { AuthGuardService } from './guard/chat-guard';

const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'chat',
    component: ChatInboxComponent,
    canActivate: [AuthGuardService],
  },

  // invalid url redirect
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [AuthGuardService],
  exports: [RouterModule],
})
export class AppRoutingModule {}
