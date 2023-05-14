import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MemberListComponent } from './components/members/member-list/member-list.component';
import { MemberDetailComponent } from './components/members/member-detail/member-detail.component';
import { ListsComponent } from './components/lists/lists.component';
import { MessagesComponent } from './components/messages/message-list/messages.component';
import { AuthenticationGuard } from './_guards/authentication.guard';
import { IntroductionComponent } from './components/introduction/introduction.component';
import { ErrorComponent } from './components/error/error.component';
import { NotFoundComponent } from './components/error/not-found/not-found.component';
import { ServerErrorComponent } from './components/error/server-error/server-error.component';
import { MemberEditComponent } from './components/members/member-edit/member-edit.component';
import { PreventUnsavedChangesGuard } from './_guards/prevent-unsaved-changes.guard';
import { MemberResolver } from './_resolvers/members/member.resolver';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canMatch: [AuthenticationGuard],
    // canDeactivate: [AuthenticationGuard]
  },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthenticationGuard],
    children: [
      { path: '', component: IntroductionComponent }, //Not working when first deactivated, conditinal rendering will be implemented.
      { path: 'members', component: MemberListComponent },
      {
        path: 'member/:id',
        component: MemberDetailComponent,
        resolve: { member: MemberResolver },
      },
      {
        path: 'members/edit',
        component: MemberEditComponent,
        canDeactivate: [PreventUnsavedChangesGuard],
      },
      { path: 'lists', component: ListsComponent },
      { path: 'messages', component: MessagesComponent },
    ],
  },
  { path: 'errors', component: ErrorComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'server-error', component: ServerErrorComponent },
  { path: '**', component: NotFoundComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
