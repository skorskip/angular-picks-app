import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Output() login = new EventEmitter<boolean>();
  loginSucces = false;

  constructor() { }

  ngOnInit() {
  }

  attemptLogin() {
    this.loginSucces = true;
    this.login.emit(this.loginSucces);
  }

}
