import { } from 'jasmine';
import { defer } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { Service } from './index';

class ObjectService extends Service<object> {
  constructor(http: any) {
    super('', '', http);
  }
}

let httpClientSpy: any;
let objectService: ObjectService;
let object1: object;

describe('Service', () => {

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    objectService = new ObjectService(httpClientSpy);
    object1 = {
      id: '1',
      name: 'Object 1',
      created: new Date()
    };
  });

  it('index should return a list of objects', (done: DoneFn) => {
    const object2: object = {
      id: '2',
      name: 'Object 2',
      created: new Date()
    };
    const objects = [object1, object2];
    const objectsGridDataResult: GridDataResult = {
      data: objects,
      total: objects.length
    };

    httpClientSpy.get.and.returnValue(defer(() => Promise.resolve(objectsGridDataResult)));

    objectService
      .index$()
      .subscribe((result: GridDataResult) => {
        expect(result).toEqual(objectsGridDataResult, 'expected objects');
        expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
        done();
      });
  });

  it('details should return a object', (done: DoneFn) => {
    httpClientSpy.get.and.returnValue(defer(() => Promise.resolve(object1)));

    objectService
      .details$([object1['id']])
      .subscribe((result: object) => {
        expect(result).toEqual(object1, 'expected object1');
        expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
        done();
      });
  });

  it('create should return a object', (done: DoneFn) => {
    httpClientSpy.post.and.returnValue(defer(() => Promise.resolve(object1)));

    objectService
      .create$(object1)
      .subscribe((result: object) => {
        expect(result).toEqual(object1, 'expected object1');
        expect(httpClientSpy.post.calls.count()).toBe(1, 'one call');
        done();
      });
  });

  it('edit should not return anything', (done: DoneFn) => {
    httpClientSpy.put.and.returnValue(defer(() => Promise.resolve()));

    objectService
      .edit$(object1)
      .subscribe((result: Object) => {
        expect(result).toBeUndefined('expected undefined');
        expect(httpClientSpy.put.calls.count()).toBe(1, 'one call');
        done();
      });
  });

  it('delete should not return anything', (done: DoneFn) => {
    httpClientSpy.delete.and.returnValue(defer(() => Promise.resolve()));

    objectService
      .delete$([object1['id']])
      .subscribe((result: Object) => {
        expect(result).toBeUndefined('expected undefined');
        expect(httpClientSpy.delete.calls.count()).toBe(1, 'one call');
        done();
      });
  });

  afterEach(() => {
    httpClientSpy = undefined;
    objectService = undefined;
    object1 = undefined;
  });

});
