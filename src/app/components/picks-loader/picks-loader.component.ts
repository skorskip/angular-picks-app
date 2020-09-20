import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'picks-loader',
  templateUrl: './picks-loader.component.html',
  styleUrls: ['./picks-loader.component.scss']
})
export class PicksLoaderComponent implements OnInit {

  constructor(
    private themeService: ThemeService
  ) { }

  ngOnInit(): void {
  }
  
  getLoader(): string {
    return this.themeService.getTheme();
  }

}
