import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import {
  AggregateDescriptor,
  CompositeFilterDescriptor,
  DataSourceRequestState,
  GroupDescriptor,
  SortDescriptor
} from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { Service } from '@clarity/services';

export abstract class IndexResolver<T> implements Resolve<GridDataResult> {

  protected filter: CompositeFilterDescriptor;
  protected sort: SortDescriptor[];
  protected aggregates: AggregateDescriptor[];
  protected group: GroupDescriptor[];

  protected constructor(private readonly service: Service<T>) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<GridDataResult> {
    const request: DataSourceRequestState = {
      filter: this.filter,
      aggregates: this.aggregates,
      group: this.group,
      sort: this.sort
    };
    return this.service.index$(request).pipe(
      map(result => result),
      take(1));
  }
}

export abstract class DetailsResolver<T> implements Resolve<T> {

  protected keyValues: any[];

  protected constructor(private readonly service: Service<T>) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<T> {
    return this.service.details$(this.keyValues).pipe(
      map(result => result),
      take(1));
  }
}
