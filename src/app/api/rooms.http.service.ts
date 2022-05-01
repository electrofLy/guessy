import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface Room {
  id: number;
  guid: string;
}

@Injectable({
  providedIn: 'root'
})
export class RoomsHttpService {
  constructor(private http: HttpClient) {}

  get(): Observable<Room[]> {
    return this.http.get<Room[]>('/api/rooms');
  }
}
