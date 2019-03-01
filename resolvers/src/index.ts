import { Resolve } from '@angular/router';
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
  }

  resolve(): Observable<GridDataResult> {
    return this.service.index$({
      skip: this.skip,
      take: this.take,
      filter: this.filter,
      aggregates: this.aggregates,
      group: this.group,
      sort: this.sort
    }).pipe(
      map(result => result),
      take(1));
  }
}

export abstract class DetailsResolver<T> implements Resolve<T> {

  protected abstract ids: any[];

  protected constructor(private readonly service: Service<T>) {
  }

  resolve(): Observable<T> {
    return this.service.details$(this.ids).pipe(
      map(result => result),
      take(1));
  }
}
