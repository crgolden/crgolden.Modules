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

export abstract class ModelController<TModel> {

  state: DataSourceRequestState;
  pageable: PagerSettings;
  sortable: SortSettings;

  protected constructor(
    protected readonly controllerName: string,
    protected readonly apiUrl: string,
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

  private toQueryString1D(keyValues: any[]): string {
    return keyValues
      .reduce((result, keyValue, i) => result + `keyValues[${i}]=${keyValue}&`, '')
      .slice(0, -1);
  }

  list$(): Observable<GridDataResult> {
    const hasGroups = this.state.group && this.state.group.length > 0;
    const queryStr = toDataSourceRequestString(this.state);

    return this.http
      .get<GridDataResult>(`${this.apiUrl}/${this.controllerName}/list?${queryStr}`)
      .pipe(map((res: GridDataResult) => ({
        data: hasGroups ? translateDataSourceResultGroups(res.data) : res.data,
        total: res.total
      })));
  }

  read$(keyValues: any[]): Observable<TModel> {
    return this.http
      .get<TModel>(`${this.apiUrl}/${this.controllerName}/read?${this.toQueryString1D(keyValues)}`);
  }

  create$(model: TModel): Observable<TModel> {
    return this.http
      .post<TModel>(`${this.apiUrl}/${this.controllerName}/create`, JSON.stringify(model), {
        headers: this.headers
      });
  }

  update$(model: TModel): Observable<Object> {
    return this.http
      .put(`${this.apiUrl}/${this.controllerName}/update`, JSON.stringify(model), {
        headers: this.headers
      });
  }

  delete$(keyValues: any[]): Observable<Object> {
    return this.http
      .delete(`${this.apiUrl}/${this.controllerName}/delete?${this.toQueryString1D(keyValues)}`);
  }
}

export abstract class RangedModelController<TModel> extends ModelController<TModel> {

  protected constructor(
    protected  readonly controllerName: string,
    protected  readonly apiUrl: string,
    protected readonly http: HttpClient) {
    super(controllerName, apiUrl, http);
  }

  private toQueryString2D(keyValues: any[][]): string {
    return keyValues
      .reduce((previous, current, i) => previous + current
        .reduce((result, keyValue, j) => result + `keyValues[${i}][${j}]=${keyValue}&`, ''), '')
      .slice(0, -1);
  }

  readRange$(keyValues: any[][]): Observable<TModel> {
    return this.http
      .get<TModel>(`${this.apiUrl}/${this.controllerName}/read-range?${this.toQueryString2D(keyValues)}`);
  }

  createRange$(models: TModel[]): Observable<TModel[]> {
    return this.http
      .post<TModel[]>(`${this.apiUrl}/${this.controllerName}/create-range`, JSON.stringify(models), {
        headers: this.headers
      });
  }

  updateRange$(models: TModel[]): Observable<Object> {
    return this.http
      .put(`${this.apiUrl}/${this.controllerName}/update-range`, JSON.stringify(models), {
        headers: this.headers
      });
  }

  deleteRange$(keyValues: any[][]): Observable<Object> {
    return this.http
      .delete(`${this.apiUrl}/${this.controllerName}/delete-range?${this.toQueryString2D(keyValues)}, [])}`);
  }
}

export abstract class ValidationController<TModel> {

  protected constructor(
    private readonly controllerName: string,
    private readonly apiUrl: string,
    protected readonly http: HttpClient) {
  }

  private get headers(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  validate(model: TModel): Observable<boolean> {
    return this.http
      .post<boolean>(`${this.apiUrl}/${this.controllerName}/validate`, JSON.stringify(model), {
        headers: this.headers
      });
  }
}
