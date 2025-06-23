import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { Observable } from 'rxjs';
import { environment } from '../../../envvironments/environment'; // Import environment
//import { from } from 'rxjs';
import { api } from '../axios';
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private baseUrl = environment.baseUrl; 
  //data: any;
 
  async getGlassesList(): Promise<Task[]> {
    try {
      const response = await api.get('/glasses'); // GET http://192.168.6.206:8080/users
      return response.data;
    } catch (error) {
      console.error('GET glasses failed', error);
      throw error;
    }
  }
  constructor(private http: HttpClient) {}
/*
  getGlassesList(): void {
    const token = localStorage.getItem('token');
    console.log(token);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    //return this.http.get<Task[]>(`${this.baseUrl}/glasses`, { headers });
    //from(api.get('/glasses'))

    //api.get('/glasses').then(res => setGroups(res.data)).catch(() => setError('Failed to load groups'));
  }*/
  
}
