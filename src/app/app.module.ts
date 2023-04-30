import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './components/nav/nav.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { ListsComponent } from './components/lists/lists.component';
import { MessagesComponent } from './components/messages/messages.component';
import { MemberListComponent } from './components/members/member-list/member-list.component';
import { MemberDetailComponent } from './components/members/member-detail/member-detail.component';
import { IntroductionComponent } from './components/introduction/introduction.component';
import { SharedModule } from './_modules/shared.module';
import { ErrorComponent } from './components/error/error.component';
import { ConfigInterceptor } from './_interceptor/config.interceptor';
import { NotFoundComponent } from './components/error/not-found/not-found.component';
import { ServerErrorComponent } from './components/error/server-error/server-error.component';
import { MemberCardComponent } from './components/members/member-card/member-card.component';
import { RequestConfigInterceptor } from './_interceptor/request-config.interceptor';
import { MemberEditComponent } from './components/members/member-edit/member-edit.component';
import { LoadingInterceptor } from './_interceptor/loading.interceptor';
import { MemberPhotoEditorComponent } from './components/members/member-photo-editor/member-photo-editor.component';
import { FilePickerComponent } from './components/shared/file-picker/file-picker.component';
@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    RegisterComponent,
    ListsComponent,
    MessagesComponent,
    MemberListComponent,
    MemberDetailComponent,
    IntroductionComponent,
    ErrorComponent,
    NotFoundComponent,
    ServerErrorComponent,
    MemberCardComponent,
    MemberEditComponent,
    MemberPhotoEditorComponent,
    FilePickerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    SharedModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ConfigInterceptor, //for Response (sorry for the naming convention)
      multi: true, //multi here is to till angular to use not only our intercepter, since there is an intercepters from provided from angular it self.
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestConfigInterceptor, //for Request
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor, //for Request
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
