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
import { Service } from '@clarity/services';

export abstract class IndexResolver<T> implements Resolve<T[]> {

  protected filter: CompositeFilterDescriptor;
  protected sort: SortDescriptor[];
  protected aggregates: AggregateDescriptor[];
  protected group: GroupDescriptor[];

  protected constructor(private readonly service: Service<T, any>) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<T[]> {
    const request: DataSourceRequestState = {
      filter: this.filter,
      aggregates: this.aggregates,
      group: this.group,
      sort: this.sort
    };
    return this.service.index$(request).pipe(
      map(result => result.data),
      take(1));
  }
}

export abstract class DetailsResolver<TClass, TKey> implements Resolve<TClass> {

  protected keyValues: TKey[];

  protected constructor(private readonly service: Service<TClass, TKey>) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TClass> {
    return this.service.details$(this.keyValues).pipe(
      map(result => result),
      take(1));
  }
}
