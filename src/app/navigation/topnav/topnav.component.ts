/* tslint:disable:all */
import {Component, OnInit, OnDestroy} from '@angular/core';
import {NavigationService} from '../navigation.service';
import {Title} from '@angular/platform-browser';
import {SearchService} from '../../shared/services/search.service';
import {StringUtils} from '../../shared/utils/string-utils';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.component.html',
  styleUrls: ['./topnav.component.scss']
})
export class TopnavComponent implements OnInit, OnDestroy {
  isLoadingRoute: boolean = false;
  sidenavOpenStyle: string;
  pageTitle: string;
  breadcrumbs: Array<{ title: string, link: any[] | string }> = [];
  autoBreadcrumbs: boolean = true;
  searchToggled: boolean = false;

  private _sidenavOpened: boolean;
  private _browserTitle: string;
  private _searchTerm: string = '';

  private _breadcrumbInterval: number;
  private _pageTitleInterval: number;
  private _subscriptions: Subscription[] = [];

  constructor(public navigation: NavigationService, public search: SearchService, private _title: Title) {
  }

  ngOnDestroy() {
    this._subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  ngOnInit() {
    this._subscriptions.push(this.navigation.openSidenavStyle.subscribe(style => {
      this.sidenavOpenStyle = style;
    }));
    this._subscriptions.push(this.navigation.isRouteLoading.subscribe(isRouteLoading => {
      this.isLoadingRoute = isRouteLoading;
    }));
    this._subscriptions.push(this.navigation.sidenavOpened.subscribe(sidenavOpen => {
      this._sidenavOpened = sidenavOpen;
    }));
    this._subscriptions.push(this.navigation.menuItems.subscribe(items => {
      if (this.autoBreadcrumbs) {
        this.updateAutoBreadcrumbs();
      }
      this.updatePageTitle();
    }));
    this._subscriptions.push(this.navigation.breadcrumbs.subscribe(breadcrumbs => {
      if (breadcrumbs !== null) {
        window.clearInterval(this._breadcrumbInterval);
        this.autoBreadcrumbs = false;
        this.breadcrumbs = breadcrumbs;
      } else {
        if (this.isLoadingRoute) {
          this._breadcrumbInterval = window.setInterval(() => {
            if (!this.isLoadingRoute) {
              window.clearInterval(this._breadcrumbInterval);
              this.updateAutoBreadcrumbs();
            }
          });
        } else {
          this.updateAutoBreadcrumbs();
        }
      }
    }));
    this._subscriptions.push(this.navigation.pageTitle.subscribe(pageTitle => {
      if (pageTitle !== null) {
        window.clearInterval(this._pageTitleInterval);
        this.pageTitle = pageTitle;
        if (this._browserTitle === null) {
          this._title.setTitle(this.navigation.getAutoBrowserTitle(pageTitle));
        }
      } else {
        if (this.isLoadingRoute) {
          this._pageTitleInterval = window.setInterval(() => {
            if (!this.isLoadingRoute) {
              window.clearInterval(this._pageTitleInterval);
              this.updatePageTitle();
            }
          });
        } else {
          this.updatePageTitle();
        }
      }
    }));
    this._subscriptions.push(this.navigation.browserTitle.subscribe(browserTitle => {
      this._browserTitle = browserTitle;
      if (browserTitle !== null) {
        this._title.setTitle(browserTitle);
      } else {
        this._title.setTitle(this.navigation.getAutoBrowserTitle(this.pageTitle));
      }
    }));

    this._subscriptions.push(this.search.searchTerm.subscribe(searchTerm => {
      if (searchTerm !== this._searchTerm) {
        this._searchTerm = searchTerm;
      }
    }));
  }

  get searchTerm(): string {
    return this._searchTerm;
  }

  set searchTerm(searchTerm: string) {
    this._searchTerm = searchTerm;
    this.search.updateSearchTerm(searchTerm);
  }

  toggleSidenav() {
    this.navigation.setSidenavOpened(!this._sidenavOpened);
  }

  toggleSearch(input: HTMLInputElement) {
    this.searchToggled = !this.searchToggled;
    if (this.searchToggled) {
      window.setTimeout(() => {
        input.focus();
      }, 0);
    }
  }

  searchBlur() {
    if (StringUtils.isEmpty(this.searchTerm)) {
      this.searchToggled = false;
    }
  }

  private updateAutoBreadcrumbs() {
    this.navigation.currentRoute.take(1).subscribe(currentRoute => {
      this.autoBreadcrumbs = true;
      this.breadcrumbs = this.navigation.getAutoBreadcrumbs(currentRoute);
    });
  }

  private updatePageTitle() {
    this.navigation.currentRoute.take(1).subscribe(currentRoute => {
      this.pageTitle = this.navigation.getAutoPageTitle(currentRoute);
      if (this._browserTitle === null) {
        this._title.setTitle(this.navigation.getAutoBrowserTitle(this.pageTitle));
      }
    });
  }

}
