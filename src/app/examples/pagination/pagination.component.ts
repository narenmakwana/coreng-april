import {Component, AfterViewInit} from '@angular/core';
import * as Prism from 'prismjs/';

@Component({
  selector : 'c-pagination',
  templateUrl : './pagination.component.html',
  styleUrls : ['./pagination.component.scss']
})
export class PaginationComponent implements AfterViewInit {

  constructor() {
  }

  ngAfterViewInit() {
    Prism.highlightAll(false);
  }
}
