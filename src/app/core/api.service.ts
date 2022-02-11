import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, take } from 'rxjs';
import { User } from './models/user/user';
import { CreateTicket } from './models/ticket/create-ticket';
import { TicketListItem } from './models/ticket/ticket-list-item';
import { environment } from '@environments/environment';
import { PostResult } from './models/post-result';
import { UserListItem } from './models/user/user-list-item';
import { BoardColumn } from './models/board-column';
import { UpdateTicketStatus } from './models/ticket/update-ticket-status';
import { LoginCredential } from './models/login-credential';
import { LoginResult } from './models/login-result';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  constructor(private http: HttpClient) { }

  login(loginCredential: LoginCredential): Observable<LoginResult> {
    return this.http.post<LoginResult>(`${environment.apiUrl}/Authentication/Login/`, loginCredential);
  }

  getUserList(): Observable<UserListItem[]> {
    return this.http.get<UserListItem[]>(`${environment.apiUrl}/User/List`);
  }

  getTicketList(includeClosed: boolean): Observable<TicketListItem[]> {
    return this.http.get<TicketListItem[]>(`${environment.apiUrl}/Ticket/List`, 
      { params: { includeClosed } });
  }

  getTicketBoard(includeClosed: boolean): Observable<BoardColumn<TicketListItem>[]> {
    return this.http.get<BoardColumn<TicketListItem>[]>(`${environment.apiUrl}/Ticket/Board`, 
    { params: { includeClosed } });
  }

  loadUser(userId: number): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/User/Get`, { params: { id: userId }});
  }

  createUser(user: User): Observable<PostResult> {
    return this.http.post<PostResult>(`${environment.apiUrl}/User/Create`, user);
  }

  updateUser(user: User): Observable<PostResult> {
    return this.http.post<PostResult>(`${environment.apiUrl}/User/Update`, user);
  }

  createTicket(ticket: CreateTicket) {
    return this.http.post(`${environment.apiUrl}/Ticket/Create`, ticket);
  }

  updateTicketStatus(model: UpdateTicketStatus) {
    return this.http.post(`${environment.apiUrl}/Ticket/UpdateStatus`, model);
  }
}
