import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppUser } from '../models/app-user.model';
import { ProducerData } from '../models/producer-data.model';
import { PilotData } from '../models/pilot-data.model';
import { ActeTraitement } from '../models/ActeTraitement ';
import { tap } from 'rxjs/operators';
import { MonthlyProducerStats } from '../models/MonthlyProducerStats';
import { BurndownPoint } from '../models/BurndownPoint';
import { HttpParams } from '@angular/common/http';

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
  getProducerStats(prestationId: number): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(
      `${this.baseUrl}/producers/stats/${prestationId}`
    );
  }
  
  getBurndownStats(prestationId: number): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(
      `http://localhost:8080/burndown-stats/${prestationId}`
    );
  }
  
  getAdditionalStats(prestationId: number): Observable<{ completionRatio: number; staffingUtilization: number }> {
    return this.http.get<{ completionRatio: number; staffingUtilization: number }>(
      `http://localhost:8080/additional-stats/${prestationId}`
    );
  }
  
  getProducerInsights(prestationId: number): Observable<{ averageEfficiencyRate: number; averageBlockageRatio: number }> {
    return this.http.get<{ averageEfficiencyRate: number; averageBlockageRatio: number }>(
      `http://localhost:8080/producerInsights/${prestationId}`
    );
  }
  
  getUserById(id: number): Observable<AppUser> {
    return this.http.get<AppUser>(`${this.baseUrl}/users/id/${id}`);
  }
  getUsersByPrestation(prestationId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/users/prestation/${prestationId}`);
  }
  //date
  getValidatedActes(userId: number, month: number, year: number) {
    return this.http.get<any[]>(`${this.baseUrl}/actes/user/${userId}/actes/validated?month=${month}&year=${year}`);
  }
  getAllActes(): Observable<ActeTraitement[]> {
    return this.http.get<ActeTraitement[]>(`${this.baseUrl}/actes`).pipe(
      tap(data => console.log('Actes reçus:', data))
    );
  }
  getMonthlyStats(month: number, year: number): Observable<MonthlyProducerStats[]> {
    return this.http.get<MonthlyProducerStats[]>(`${this.baseUrl}/api/stats/monthly-stats?month=${month}&year=${year}`);
  }
    //GLOBAL STATS
  getBurndownData(year: number, month: number, prestationId: number): Observable<BurndownPoint[]> {
    return this.http.get<BurndownPoint[]>(
      `${this.baseUrl}/api/stats/burndown?year=${year}&month=${month}&prestationId=${prestationId}`
    );
  }
   // 🔹 Get general monthly statistics
   getGeneralMonthlyStatistics(year: number, month: number): Observable<Map<string, any>> {
    return this.http.get<Map<string, any>>(`${this.baseUrl}/api/stats/general-stats?year=${year}&month=${month}`);
  }
  //PILOT DATA SNAPSHOT FETCH 
  getMonthlyPilotStats(pilotId: number, year: number, month: number, prestationId: number): Observable<any> {
    const url = `${this.baseUrl}/api/monthly-pilot-stats`;
  
    const params = new HttpParams()
      .set('pilotId', pilotId.toString())
      .set('year', year.toString())
      .set('month', month.toString())
      .set('prestationId', prestationId.toString());
  
    return this.http.get(url, { params });
  }
  getLivePilotData(pilotId: number): Observable<PilotData> {
    return this.http.get<PilotData>(`${this.baseUrl}/calculet-live-pilot-data?pilotId=${pilotId}`);
  }
  
  getPilotStats(pilotId: number): Observable<{
    completionRate: number;
    blockageRate: number;
    targetPerformance: number;
    RAFPerformance: number;
  }> {
    return this.http.get<{
      completionRate: number;
      blockageRate: number;
      targetPerformance: number;
      RAFPerformance: number;
    }>(`${this.baseUrl}/api/stats/pilotstats/${pilotId}`);
  }
}
  
  

export { AppUser };

