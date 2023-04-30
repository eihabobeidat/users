import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../../_models/member';
import { map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  members: Member[] = [];
  constructor(private http: HttpClient) {}

  getMembers() {
    if (this.members.length > 0) return of(this.members);
    return this.http.get<Member[]>(environment.apiUrl + 'Users').pipe(
      map((members) => {
        this.members = members;
        return members;
      })
    );
  }

  getMember(userIdentity: string) {
    const member = this.members.find(
      (member) => member.userName === userIdentity
    );
    if (member) return of(member);
    return this.http.get<Member>(environment.apiUrl + 'Users/' + userIdentity);
  }

  UpdateMember(member: Member) {
    return this.http.put(environment.apiUrl + 'Users', member).pipe(
      map(() => {
        let index = this.members.indexOf(member);
        this.members[index] = { ...this.members[index], ...member };
      })
    );
  }

  SetMainPhoto(photoId: number) {
    return this.http.put(
      environment.apiUrl + 'Users/set-main-photo/' + photoId,
      {}
    );
  }

  deletePhoto(photoId: number) {
    return this.http.delete(
      environment.apiUrl + 'Users/delete-photo/' + photoId
    );
  }
}
