import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUsersWithRoles() {
    return this.http.get(this.baseUrl + 'Admin/users-with-roles');
  }

  updateUserRoles(username: string, roles: string) {
    return this.http.post(
      this.baseUrl + 'Admin/edit-roles/' + `${username}?roles=${roles}`,
      {}
    );
  }

  getUserPhotos() {
    return this.http.get(this.baseUrl + 'Admin/photos-to-moderate');
  }
}
