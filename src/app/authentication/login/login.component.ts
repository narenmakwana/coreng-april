import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector : 'c-login',
  templateUrl : './login.component.html',
  styleUrls : ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;

  constructor(private _router: Router) {
  }

  ngOnInit() {
  }

  login() {
    this._router.navigateByUrl('/examples/dashboard');
  }

}
