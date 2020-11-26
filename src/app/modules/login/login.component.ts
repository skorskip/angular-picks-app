import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/data-models/user/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { Router } from '@angular/router';
import { ThemeService } from 'src/app/services/theme/theme.service';

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
    private authService: AuthenticationService,
    public snackBar: MatSnackBar,
    private router: Router,
    private themeService: ThemeService
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.themeService.setTheme(this.themeService.getTheme());
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
    
    this.authService.login(user).subscribe((loginUser) => {
      if(loginUser != null) {
        this.authService.getUserInfo(user).subscribe((users) => {
          if(users.length != 0) {
            if(users[0].status === "active") {
              this.loginSucces = true;
              this.router.navigate(['/games']);
              setTimeout(() => {
                window.location.reload();
              });
            }
          } else {
            this.forgotten = true;
          }
        });
      }
    });
  }

}
