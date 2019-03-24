import { StandingsModule } from './standings.module';

describe('StandingsModule', () => {
  let standingsModule: StandingsModule;

  beforeEach(() => {
    standingsModule = new StandingsModule();
  });

  it('should create an instance', () => {
    expect(standingsModule).toBeTruthy();
  });
});
