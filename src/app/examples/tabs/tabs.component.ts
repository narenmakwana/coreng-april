import {Component, AfterViewInit} from '@angular/core';
import * as Prism from 'prismjs/';

@Component({
  selector: 'c-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements AfterViewInit {

  constructor() {
  }

  ngAfterViewInit() {
    Prism.highlightAll(false);
  }
}
