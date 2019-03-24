import { MyStatsModule } from './my-stats.module';

describe('MyStatsModule', () => {
  let myStatsModule: MyStatsModule;

  beforeEach(() => {
    myStatsModule = new MyStatsModule();
  });

  it('should create an instance', () => {
    expect(myStatsModule).toBeTruthy();
  });
});
