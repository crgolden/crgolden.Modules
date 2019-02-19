import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  toDataSourceRequestString,
  translateDataSourceResultGroups,
  DataSourceRequestState
} from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';

export abstract class Service<T> {

  protected constructor(
    private readonly controllerName: string,
    private readonly apiUrl: string,
    protected readonly http: HttpClient) {
  }

  protected get headers(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  protected getQueryString = (ids: Array<object>): string => ids
    .reduce((result: string, id: object, index: number) => result + `ids[${index}]=${id}&`, '')
    .slice(0, -1);

  index$(state: DataSourceRequestState): Observable<GridDataResult> {
    const hasGroups = state.group && state.group.length > 0;
    const queryStr = toDataSourceRequestString(state);

    return this.http
      .get<GridDataResult>(`${this.apiUrl}/${this.controllerName}/index?${queryStr}`)
      .pipe(map((res: GridDataResult) => ({
        data: hasGroups ? translateDataSourceResultGroups(res.data) : res.data,
        total: res.total
      })));
  }

  details$(ids: Array<object>): Observable<T> {
    return this.http
      .get<T>(`${this.apiUrl}/${this.controllerName}/details?${this.getQueryString(ids)}`);
  }

  create$(model: T): Observable<T> {
    return this.http
      .post<T>(`${this.apiUrl}/${this.controllerName}/create`, JSON.stringify(model), {
        headers: this.headers
      });
  }

  createRange$(models: Array<T>): Observable<Array<T>> {
    return this.http
      .post<Array<T>>(`${this.apiUrl}/${this.controllerName}/create-range`, JSON.stringify(models), {
        headers: this.headers
      });
  }

  edit$(model: T): Observable<Object> {
    return this.http
      .put(`${this.apiUrl}/${this.controllerName}/edit`, JSON.stringify(model), {
        headers: this.headers
      });
  }

  editRange$(models: Array<T>): Observable<Object> {
    return this.http
      .put(`${this.apiUrl}/${this.controllerName}/edit-range`, JSON.stringify(models), {
        headers: this.headers
      });
  }

  delete$(ids: Array<object>): Observable<Object> {
    return this.http
      .delete(`${this.apiUrl}/${this.controllerName}/delete?${this.getQueryString(ids)}`);
  }
}
