import { } from 'jasmine';
import { defer } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { ModelController } from './index';

class ObjectController extends ModelController<object> {
  constructor(http: any) {
    super('', '', http);
  }
}

let httpClientSpy: any;
let objectController: ObjectController;
let object1: object;

describe('ModelController', () => {

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    objectController = new ObjectController(httpClientSpy);
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

    objectController
      .list$()
      .subscribe((result: GridDataResult) => {
        expect(result).toEqual(objectsGridDataResult, 'expected objects');
        expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
        done();
      });
  });

  it('details should return a object', (done: DoneFn) => {
    httpClientSpy.get.and.returnValue(defer(() => Promise.resolve(object1)));

    objectController
      .read$([object1['id']])
      .subscribe((result: object) => {
        expect(result).toEqual(object1, 'expected object1');
        expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
        done();
      });
  });

  it('create should return a object', (done: DoneFn) => {
    httpClientSpy.post.and.returnValue(defer(() => Promise.resolve(object1)));

    objectController
      .create$(object1)
      .subscribe((result: object) => {
        expect(result).toEqual(object1, 'expected object1');
        expect(httpClientSpy.post.calls.count()).toBe(1, 'one call');
        done();
      });
  });

  it('edit should not return anything', (done: DoneFn) => {
    httpClientSpy.put.and.returnValue(defer(() => Promise.resolve()));

    objectController
      .update$(object1)
      .subscribe((result: Object) => {
        expect(result).toBeUndefined('expected undefined');
        expect(httpClientSpy.put.calls.count()).toBe(1, 'one call');
        done();
      });
  });

  it('delete should not return anything', (done: DoneFn) => {
    httpClientSpy.delete.and.returnValue(defer(() => Promise.resolve()));

    objectController
      .delete$([object1['id']])
      .subscribe((result: Object) => {
        expect(result).toBeUndefined('expected undefined');
        expect(httpClientSpy.delete.calls.count()).toBe(1, 'one call');
        done();
      });
  });

  afterEach(() => {
    httpClientSpy = undefined;
    objectController = undefined;
    object1 = undefined;
  });

});
