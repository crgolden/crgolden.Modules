import { } from 'jasmine';
import { defer } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { Service } from './index';

class EntityService extends Service<object, string> {
  constructor(http: any) {
    super('', '', http);
  }
}

let httpBaseEntitySpy: any;
let entityService: EntityService;
let entity1: object;

describe('EntityService', () => {

  beforeEach(() => {
    httpBaseEntitySpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    entityService = new EntityService(httpBaseEntitySpy);
    entity1 = {
      id: '1',
      name: 'Entity 1',
      created: new Date()
    };
  });

  it('index should return a list of entities', (done: DoneFn) => {
    const entity2: object = {
      id: '2',
      name: 'Entity 2',
      created: new Date()
    };
    const entities = new Array<object>(entity1, entity2);
    const entitiesGridDataResult: GridDataResult = {
      data: entities,
      total: entities.length
    };

    httpBaseEntitySpy.get.and.returnValue(defer(() => Promise.resolve(entitiesGridDataResult)));

    entityService
      .index$({})
      .subscribe((result: GridDataResult) => {
        expect(result).toEqual(entitiesGridDataResult, 'expected entities');
        expect(httpBaseEntitySpy.get.calls.count()).toBe(1, 'one call');
        done();
      });
  });

  it('details should return a entity', (done: DoneFn) => {
    httpBaseEntitySpy.get.and.returnValue(defer(() => Promise.resolve(entity1)));

    entityService
      .details$(new Array<string>(entity1['id']))
      .subscribe((result: object) => {
        expect(result).toEqual(entity1, 'expected entity1');
        expect(httpBaseEntitySpy.get.calls.count()).toBe(1, 'one call');
        done();
      });
  });

  it('create should return a entity', (done: DoneFn) => {
    httpBaseEntitySpy.post.and.returnValue(defer(() => Promise.resolve(entity1)));

    entityService
      .create$(entity1)
      .subscribe((result: object) => {
        expect(result).toEqual(entity1, 'expected entity1');
        expect(httpBaseEntitySpy.post.calls.count()).toBe(1, 'one call');
        done();
      });
  });

  it('edit should not return anything', (done: DoneFn) => {
    httpBaseEntitySpy.put.and.returnValue(defer(() => Promise.resolve()));

    entityService
      .edit$(entity1)
      .subscribe((result: Object) => {
        expect(result).toBeUndefined('expected undefined');
        expect(httpBaseEntitySpy.put.calls.count()).toBe(1, 'one call');
        done();
      });
  });

  it('delete should not return anything', (done: DoneFn) => {
    httpBaseEntitySpy.delete.and.returnValue(defer(() => Promise.resolve()));

    entityService
      .delete$(new Array<string>(entity1['id']))
      .subscribe((result: Object) => {
        expect(result).toBeUndefined('expected undefined');
        expect(httpBaseEntitySpy.delete.calls.count()).toBe(1, 'one call');
        done();
      });
  });

  afterEach(() => {
    httpBaseEntitySpy = undefined;
    entityService = undefined;
    entity1 = undefined;
  });

});
