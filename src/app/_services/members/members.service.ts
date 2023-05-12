import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../../_models/member';
import { map, of, take } from 'rxjs';
import { PaginatedResult } from 'src/app/_models/pagination';
import { UserParams } from 'src/app/_models/userParams';
import { AccountService } from '../authentication/account.service';
import { User } from 'src/app/_models/user';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  members: Member[] = [];
  paginatedResult: PaginatedResult<Member[]>;
  membersCache = new Map();
  paginationCache = new Map();
  userParamsCached: UserParams;
  constructor(private http: HttpClient) {}

  getMembers(userParams: UserParams) {
    this.userParamsCached = userParams;
    const response = this.membersCache.get(Object.values(userParams).join('-'));
    const pagination = this.paginationCache.get(
      Object.values(userParams).join('-')
    );

    if (response && pagination) {
      this.members = response;
      this.paginatedResult = { pagination: pagination, result: response };
      return of(this.members);
    }

    let params = this._getPaginationHeaders(userParams);

    return this.getPaginatedResult<Member[]>(
      environment.apiUrl + 'Users',
      params,
      userParams
    );
  }

  private getPaginatedResult<T>(
    url: string,
    params: HttpParams,
    userParams?: UserParams
  ) {
    return this.http
      .get<T>(url, {
        observe: 'response',
        params,
      })
      .pipe(
        map((response) => {
          let pagination = response.headers.get('pagination');
          if (response.body && pagination) {
            this.membersCache.set(
              Object.values(userParams).join('-'),
              response.body as Member[]
            );
            this.paginationCache.set(
              Object.values(userParams).join('-'),
              JSON.parse(pagination)
            );
            this.members = response.body as Member[];
            this.paginatedResult = {
              pagination: JSON.parse(pagination),
              result: response.body as Member[],
            };
          }
          return response.body as Member[];
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

  addLike(username: string) {
    return this.http.post(environment.apiUrl + 'Likes/' + username, {});
  }

  getLikes(
    predicate: 'liked' | 'likedBy',
    pageNumber: number,
    pageSize: number
  ) {
    let params = new HttpParams(); //OrderBy
    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', pageSize);
    params = params.append('predicate', predicate);
    return this.http.get<Member[]>(environment.apiUrl + 'Likes', {
      params,
      observe: 'response',
    });
  }

  private _canUseCachedData(requestedPage, pageSize): boolean {
    return false; //testing, function needs improvments regarding filter used

    let { currentPage, itemsPerPage } = this.paginatedResult.pagination;

    if (!requestedPage && !pageSize) {
      return currentPage === 1; //in this case the last requested memebers most likely where default and this is good enough
    }

    if (requestedPage && pageSize) {
      return pageSize !== itemsPerPage || requestedPage === currentPage; //in this case there is no changes in the pagination (dublicate hit)
    }

    if (pageSize) {
      return pageSize !== itemsPerPage;
    }

    if (requestedPage) {
      return requestedPage === currentPage;
    }
  }

  private _getPaginationHeaders(userParams: UserParams) {
    let params = new HttpParams(); //OrderBy
    params = params.append('pageNumber', userParams.page);
    params = params.append('pageSize', userParams.itemsPerPage);
    params = params.append('gender', userParams.gender);
    params = params.append('minimumAge', userParams.minimumAge);
    params = params.append('maximumAge', userParams.maximumAge);
    params = params.append('orderBy', userParams.orderBy);
    return params;
  }
}
