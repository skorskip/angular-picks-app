import { MyPicksDashboardModule } from './my-picks-dashboard.module';

describe('MyPicksDashboardModule', () => {
  let myPicksDashboardModule: MyPicksDashboardModule;

  beforeEach(() => {
    myPicksDashboardModule = new MyPicksDashboardModule();
  });

  it('should create an instance', () => {
    expect(myPicksDashboardModule).toBeTruthy();
  });
});
