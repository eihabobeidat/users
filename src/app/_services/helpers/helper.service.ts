import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { PaginatedResult } from 'src/app/_models/pagination';

export function getPaginatedResult<T>(
  http: HttpClient,
  url: string,
  params: HttpParams
) {
  const paginatedResult: PaginatedResult<T> = new PaginatedResult();

  return http
    .get<T>(url, {
      observe: 'response',
      params,
    })
    .pipe(
      map((response) => {
        let pagination = response.headers.get('pagination');
        let result = response.body;

        if (result) {
          paginatedResult.result = result;
        }

        if (pagination) {
          paginatedResult.pagination = JSON.parse(pagination);
        }

        return paginatedResult;
      })
    );
}

export function getPaginationHeaders(
  pageNumber: number = 1,
  pageSize: number = 6
) {
  let params = new HttpParams(); //OrderBy
  params = params.append('pageNumber', pageNumber);
  params = params.append('pageSize', pageSize);
  return params;
}
