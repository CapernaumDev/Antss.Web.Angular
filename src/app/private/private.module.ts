import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxEditorModule } from 'ngx-editor';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

import { CoreModule } from '@app/core/core.module';
import { AuthGuard } from '@app/core/authentication.guard';
import { UserComponent } from './admin/user.component';
import { UserListComponent } from './admin/user-list.component';
import { TicketListComponent } from './tickets/ticket-list.component';
import { MyProfileComponent } from '@app/private/my-profile/my-profile.component';
import { CreateTicketComponent } from './tickets/create-ticket.component';
import { TicketBoardComponent } from './tickets/board.component';
import { TicketBoardItemComponent } from './tickets/board-item.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    UserComponent,
    UserListComponent,
    TicketListComponent,
    CreateTicketComponent,
    MyProfileComponent,
    TicketBoardComponent,
    TicketBoardItemComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    NgxEditorModule,
    NgbTypeaheadModule,
    DragDropModule,
    RouterModule.forRoot([
      { path: 'user-list', component: UserListComponent, canActivate: [AuthGuard], data: { role: ['Admin'], reuse: true }  },
      { path: 'user', component: UserComponent, canActivate: [AuthGuard], data: { role: ['Admin'] }  },
      { path: 'user/:id', component: UserComponent, canActivate: [AuthGuard], data: { role: ['Admin'] }  },
      { path: 'ticket-list', component: TicketListComponent, canActivate: [AuthGuard], data: { reuse: true } },
      { path: 'ticket-board', component: TicketBoardComponent, canActivate: [AuthGuard], data: { reuse: true } },
      { path: 'create-ticket', component: CreateTicketComponent, canActivate: [AuthGuard], },
      { path: 'my-profile', component: MyProfileComponent, canActivate: [AuthGuard], data: { reuse: true } }
    ])
  ],
  exports: [
  ]
})
export class PrivateModule { }

