import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/data-models/user/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { Router } from '@angular/router';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { Auth } from 'aws-amplify';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Output() login = new EventEmitter<boolean>();
  @Output() registerEvent = new EventEmitter<boolean>();

  hide = true;
  hide1 = true;
  forgotten = false;
  notMatch = false;
  registerSelected = false
  submitLogin = false;
  completeLoginForm = false;
  forgotPasswordForm = false;
  authUser;

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

  forgotPassword(username) {
    this.forgotPasswordForm = true;
    Auth.forgotPassword(username).then(data => {
      this.snackBar.open("Email sent",'', {duration:3000, panelClass:["success-snack", "quaternary-background", "secondary"]});
    }).catch(err => {
      this.snackBar.open("Failed to send email",'', {duration:3000, panelClass:["failure-snack", "quaternary-background", "secondary"]});
    });
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

  attemptLogin(username, password, confirmPassword, code) {
    this.submitLogin = true;
    if(this.forgotPasswordForm) {
      this.completeForgotPassword(username, password, confirmPassword, code);
    } else if(this.completeLoginForm) {
      this.completeLogin(username, password, confirmPassword);
    } else {
      this.authorize(username, password);
    }
  }

  completeForgotPassword(username, password, confirmPassword, code) {
    this.notMatch = (password !== confirmPassword);
    if(!this.notMatch) {
      this.authService.forgotPassword(username, password, code).subscribe((loginUser) => {
        if(loginUser != null) {
          this.getUserInfo(username, password);
        } else {
          this.forgotten = true;
          this.submitLogin = false;
        }
      })
    }
  }

  completeLogin(username, password, confirmPassword) {
    this.notMatch = (password !== confirmPassword);
    if(!this.notMatch) {
      this.authService.completePasswordLogin(password, this.authUser).subscribe((loginUser) => {
        if(loginUser != null) {
          this.getUserInfo(username, password);
        } else {
          this.forgotten = true;
          this.submitLogin = false;
        }
      });
    }
  }

  authorize(username, password) {
    this.authService.login(username,password).subscribe((loginUser) => {
      if(loginUser != null) {
        if(loginUser.challengeName != null && loginUser.challengeName === 'NEW_PASSWORD_REQUIRED') { 
          this.authUser = loginUser;
          this.completeLoginForm = true;
        } else {
          this.getUserInfo(username, password);
        }
      } else {
        this.forgotten = true;
        this.submitLogin = false;
      }
    });
  }

  getUserInfo(username, password) {
    setTimeout(() => {
      this.authService.getUserInfo(username, password).subscribe((users) => {
        this.submitLogin = false;
        if(users.length != 0) {
          if(users[0].status === "active") {
            this.router.navigate(['/games']);
            setTimeout(() => {window.location.reload()});
          }
        } else {
          this.forgotten = true;
        }
      });
    });
  }

}
