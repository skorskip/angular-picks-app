import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UserService } from '../../data-models/user/user.service';
import { User } from 'src/app/data-models/user/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Output() login = new EventEmitter<boolean>();
  @Output() registerEvent = new EventEmitter<boolean>();

  loginSucces = false;
  hide = true;
  forgotten = false;
  registerSelected = false

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
  }

  forgotUsername() {
    console.log("sending email");
  }

  forgotPassword() {
    console.log("Who are you?");
  }

  register() {
    this.registerEvent.emit(true);
    this.registerSelected = true;
  }

  registered(event: boolean) {
    if(event) {
      this.registerSelected = false;
    }
  }

  attemptLogin(username, password) {
    var user = new User();
    user.user_name = username;
    user.password = password;
    
    this.userService.login(user).subscribe((users) => {
      if(users.length != 0) {
        this.loginSucces = true;
        this.login.emit(this.loginSucces);
      } else {
        this.forgotten = true;
      }
    });
  }

}
