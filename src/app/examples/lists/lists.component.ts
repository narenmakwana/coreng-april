import {Component, AfterViewInit} from '@angular/core';
import * as Prism from 'prismjs/';

@Component({
  selector: 'c-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent implements AfterViewInit {
  messages: {from: string, subject: string, message: string, avatarUrl: string}[] = [
    {from: 'Nancy', subject: 'Brunch?', message: 'Did you want to go on Sunda...', avatarUrl: '/assets/images/yuna.jpg'},
    {from: 'Mary', subject: 'Summer BBQ', message: 'Wish I could come, but ...', avatarUrl: '/assets/images/man.jpg'},
    {from: 'Bobby', subject: 'Oui oui', message: 'Do you have Paris reservation...', avatarUrl: '/assets/images/yuna.jpg'},
  ];

  folders: {name: string, updated: string}[] = [
    {name: 'Photos', updated: 'Jan 1, 2016'},
    {name: 'Recipes', updated: 'Jan 17, 2016'},
    {name: 'Work', updated: 'Jan 28, 2016'}
  ];

  notes: {name: string, updated: string}[] = [
    {name: 'Vacation Itinerary', updated: 'Feb 20, 2016'},
    {name: 'Kitchen Remodel', updated: 'Jan 18, 2016'}
  ];

  constructor() {
  }

  ngAfterViewInit() {
    Prism.highlightAll(false);
  }
}
