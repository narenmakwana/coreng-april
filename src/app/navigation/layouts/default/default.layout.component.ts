/* tslint:disable:all */
import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {MdSidenav} from '@angular/material';
import {NavigationService} from '../../navigation.service';
import {Observable, Subscription} from 'rxjs';

@Component({
  templateUrl : './default.layout.component.html',
  styleUrls : ['./default.layout.component.scss']
})
export class DefaultLayoutComponent implements OnInit, OnDestroy {
  @ViewChild(MdSidenav) sideNav: MdSidenav;

  sidenavStyle: string = 'side';
  isHovering: boolean = false;
  isHoveringNew: boolean = false;
  private sidenavOpened: boolean = true;
  private _isHoveringTimeout: number;
  private _subscriptions: Subscription[] = [];

  constructor(public navigation: NavigationService) {
  }

  ngOnDestroy() {
    this._subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  ngOnInit() {
    if(this.navigation.mediumScreenAndDown) {
      this.sideNav.close();
    }

    let lastWindowSize: number = 0;
    let combined = Observable.combineLatest(this.navigation.sidenavOpened, this.navigation.openSidenavStyle, this.navigation.closedSidenavStyle, this.navigation.windowSize, (opened, openStyle, closedStyle, windowSize) => {
      let screenSizeChange: boolean = false;
      if(windowSize !== lastWindowSize) {
        lastWindowSize = windowSize;
        screenSizeChange = true;
      }
      return {opened, openStyle, closedStyle, screenSizeChange};
    });

    this._subscriptions.push(combined.subscribe((p: {opened: boolean, openStyle: string, closedStyle: string, screenSizeChange: boolean}) => {
      if(p.openStyle === 'off') {
        this.sidenavOpened = false;
        this.sidenavStyle = 'over';
        this.sideNav.close();
        return;
      }
      this.sidenavOpened = p.opened;
      if(this.navigation.largeScreen) {
        if(p.opened) {
          this.sidenavStyle = p.openStyle;
        } else {
          this.sidenavStyle = p.closedStyle;
        }
        if(this.sidenavStyle !== 'off' && (this.sidenavStyle !== 'hidden' || p.opened) && (this.sidenavStyle !== 'push' || p.opened)) {
          this.sideNav.open();
        } else {
          this.sideNav.close();
        }
      } else {
        this.sidenavStyle = 'over';
        if(p.opened && !p.screenSizeChange) {
          this.sideNav.open();
        } else {
          this.sideNav.close();
        }
      }
    }));
    if(this.sidenavStyle === 'hidden' || this.sidenavStyle === 'push') {
      this.sideNav.close(); // Close on initial load
    }
  }

  public get sidenavMode(): string {
    if(this.sidenavStyle === 'icon overlay' && this.isHovering) {
      return 'over';
    } else if(this.sidenavStyle === 'icon' || this.sidenavStyle === 'icon overlay') {
      return 'side';
    } else if(this.sidenavStyle === 'hidden') {
      return 'over';
    } else if(this.sidenavStyle === 'off') {
      return 'over';
    }
    return this.sidenavStyle;
  }

  sidenavToggle(opened: boolean) {
    this.navigation.setSidenavOpened(opened);
  }

  toggleHover(isHovering: boolean) {
    this.isHoveringNew = isHovering;
    if(isHovering) {
      this.isHovering = true;
    } else if(this._isHoveringTimeout !== 0) {
      this._isHoveringTimeout = window.setTimeout(() => {
        this.isHovering = this.isHoveringNew;
      }, 50);
    }
  }

}
