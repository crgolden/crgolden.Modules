import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import {
  AggregateDescriptor,
  CompositeFilterDescriptor,
  GroupDescriptor,
  SortDescriptor
} from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { Service } from '@clarity/services';

export abstract class IndexResolver<T> implements Resolve<GridDataResult> {

  protected skip: number;
  protected take: number;
  protected filter: CompositeFilterDescriptor;
  protected sort: SortDescriptor[];
  protected aggregates: AggregateDescriptor[];
  protected group: GroupDescriptor[];

  protected constructor(private readonly service: Service<T>) {
    this.take = 5;
    this.sort = [{
      field: 'created',
      dir: 'desc'
    }];
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<GridDataResult> {
    this.service.state.skip = this.skip;
    this.service.state.take = this.take;
    this.service.state.filter = this.filter;
    this.service.state.aggregates = this.aggregates;
    this.service.state.group = this.group;
    this.service.state.sort = this.sort;
    return this.service.index$().pipe(
      map(result => result),
      take(1));
  }
}

export abstract class DetailsResolver<T> implements Resolve<T> {

  protected ids: any[];

  protected constructor(private readonly service: Service<T>) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<T> {
    return this.service.details$(this.ids).pipe(
      map(result => result),
      take(1));
  }
}
