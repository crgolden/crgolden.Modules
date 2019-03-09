import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  DataSourceRequestState,
  toDataSourceRequestString,
  translateDataSourceResultGroups
} from '@progress/kendo-data-query';
import {
  GridDataResult,
  PagerSettings,
  SortSettings
} from '@progress/kendo-angular-grid';

export abstract class Service<TClass> {

  state: DataSourceRequestState;
  pageable: PagerSettings;
  sortable: SortSettings;

  protected constructor(
    private readonly controllerName: string,
    private readonly apiUrl: string,
    protected readonly http: HttpClient) {
    this.state = {
    };
    this.pageable = {
      buttonCount: 1,
      type: 'numeric',
      info: false,
      previousNext: true
    };
    this.sortable = {
      allowUnsort: false,
      mode: 'single'
    };
  }

  protected get headers(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  protected toQueryString(ids: any[]): string {
    return ids
      .reduce((result, id, index) => result + `ids[${index}]=${id}&`, '')
      .slice(0, -1);
  }

  index$(): Observable<GridDataResult> {
    const hasGroups = this.state.group && this.state.group.length > 0;
    const queryStr = toDataSourceRequestString(this.state);

    return this.http
      .get<GridDataResult>(`${this.apiUrl}/${this.controllerName}/index?${queryStr}`)
      .pipe(map((res: GridDataResult) => ({
        data: hasGroups ? translateDataSourceResultGroups(res.data) : res.data,
        total: res.total
      })));
  }

  details$(ids: any[]): Observable<TClass> {
    return this.http
      .get<TClass>(`${this.apiUrl}/${this.controllerName}/details?${this.toQueryString(ids)}`);
  }

  create$(model: TClass): Observable<TClass> {
    return this.http
      .post<TClass>(`${this.apiUrl}/${this.controllerName}/create`, JSON.stringify(model), {
        headers: this.headers
      });
  }

  createRange$(models: TClass[]): Observable<TClass[]> {
    return this.http
      .post<TClass[]>(`${this.apiUrl}/${this.controllerName}/create-range`, JSON.stringify(models), {
        headers: this.headers
      });
  }

  edit$(model: TClass): Observable<Object> {
    return this.http
      .put(`${this.apiUrl}/${this.controllerName}/edit`, JSON.stringify(model), {
        headers: this.headers
      });
  }

  editRange$(models: TClass[]): Observable<Object> {
    return this.http
      .put(`${this.apiUrl}/${this.controllerName}/edit-range`, JSON.stringify(models), {
        headers: this.headers
      });
  }

  delete$(ids: any[]): Observable<Object> {
    return this.http
      .delete(`${this.apiUrl}/${this.controllerName}/delete?${this.toQueryString(ids)}`);
  }
}
