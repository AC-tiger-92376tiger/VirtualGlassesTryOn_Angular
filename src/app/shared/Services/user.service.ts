import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserModel } from '../models/usermodel.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5259/api/user';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(this.apiUrl);
  }

  getUser(id: number): Observable<UserModel> {
    return this.http.get<UserModel>(`${this.apiUrl}/${id}`);
  }

  createUsers(usermodel: UserModel): Observable<UserModel> {
    return this.http.post<UserModel>(this.apiUrl, usermodel);
  }

  updateTask(usermodel: UserModel): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${usermodel.id}`, usermodel);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
