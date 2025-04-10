import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppUser } from '../models/app-user.model';
import { ProducerData } from '../models/producer-data.model';
import { PilotData } from '../models/pilot-data.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  // 🔹 Create a new user
  createUser(user: AppUser): Observable<AppUser> {
    return this.http.post<AppUser>(`${this.baseUrl}/users`, user);
  }

  // 🔹 Get all users
  getAllUsers(): Observable<AppUser[]> {
    return this.http.get<AppUser[]>(`${this.baseUrl}/users`);  // Corrected URL
  }

  // 🔹 Get one user by ID
  getUser(id: number): Observable<AppUser> {
    return this.http.get<AppUser>(`${this.baseUrl}/users/${id}`);
  }

  // 🔹 Attach ProducerData to user
  addProducerData(userId: number, data: ProducerData): Observable<AppUser> {
    return this.http.post<AppUser>(`${this.baseUrl}/${userId}/producer-data`, data);
  }

  // 🔹 Attach PilotData to user
  addPilotData(userId: number, data: PilotData): Observable<AppUser> {
    return this.http.post<AppUser>(`${this.baseUrl}/${userId}/pilot-data`, data);
  }

  // 🔹 Delete user
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/users/${id}`);
  }

  // ✅ Get all users with their data
  getAllUsersWithData(): Observable<AppUser[]> {
    return this.http.get<AppUser[]>(`${this.baseUrl}/users`);
  }

  // ✅ Update ProducerData
  updateProducerData(producerId: number, data: ProducerData): Observable<ProducerData> {
    return this.http.put<ProducerData>(`${this.baseUrl}/producers/${producerId}`, data);
  }

  // ✅ Update PilotData
  updatePilotData(pilotId: number, data: PilotData): Observable<PilotData> {
    return this.http.put<PilotData>(`${this.baseUrl}/pilots/${pilotId}`, data);
  }
  getProducerStats(): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(`${this.baseUrl}/producers/stats`);
  }
  
  
}
export { AppUser };

