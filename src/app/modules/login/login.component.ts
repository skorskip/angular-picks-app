import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms'
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
  emptyUsername = false;
  authUser;
  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
    code: new FormControl(''),
    confirmPassword: new FormControl('')
  }) 

  constructor(
    private authService: AuthenticationService,
    public snackBar: MatSnackBar,
    private router: Router,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.themeService.setTheme(this.themeService.getTheme());
  }

  forgotPassword(form) {
    this.forgotten = false;
    this.loginForm.reset({password: '', username: form.username});
    if(form.username == null || form.username == '') {
      this.emptyUsername = true;
    } else {
      this.forgotPasswordForm = true;
      Auth.forgotPassword(form.username).then(data => {
        this.snackBar.open("Email sent",'', {duration:3000, panelClass:["success-snack", "quaternary-background", "secondary"]});
      }).catch(err => {
        this.snackBar.open("Failed to send email",'', {duration:3000, panelClass:["failure-snack", "quaternary-background", "secondary"]});
      });
    }
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

  attemptLogin(form) {
    this.submitLogin = true;
    if(this.forgotPasswordForm) {
      this.completeForgotPassword(form.username, form.password, form.confirmPassword, form.code);
    } else if(this.completeLoginForm) {
      this.completeLogin(form.username, form.password, form.confirmPassword);
    } else {
      this.authorize(form.username, form.password);
    }
  }

  completeForgotPassword(username, password, confirmPassword, code) {
    this.notMatch = (password !== confirmPassword);
    if(!this.notMatch) {
      this.authService.forgotPassword(username, password, code).subscribe((loginUser) => {
        if(loginUser != null) {
          this.snackBar.open("Password changed.",'', {duration:3000, panelClass:["success-snack", "quaternary-background", "secondary"]});
          this.getUserInfo(username, password);
        } else {
          this.forgotten = true;
          this.submitLogin = false;
        }
      })
    } else {
      this.snackBar.open("Passwords don't match.",'', {duration:3000, panelClass:["failure-snack", "quaternary-background", "secondary"]});
    }
  }

  completeLogin(username, password, confirmPassword) {
    this.notMatch = (password !== confirmPassword);
    if(!this.notMatch) {
      this.authService.completePasswordLogin(password, this.authUser).subscribe((loginUser) => {
        if(loginUser != null) {
          this.snackBar.open("Login complete.",'', {duration:3000, panelClass:["success-snack", "quaternary-background", "secondary"]});
          this.getUserInfo(username, password);
        } else {
          this.forgotten = true;
          this.submitLogin = false;
        }
      });
    } else {
      this.snackBar.open("Passwords don't match.",'', {duration:3000, panelClass:["failure-snack", "quaternary-background", "secondary"]});
    }
  }

  authorize(username, password) {
    this.authService.login(username,password).subscribe((loginUser) => {
      if(loginUser != null) {
        if(loginUser.challengeName != null && loginUser.challengeName === 'NEW_PASSWORD_REQUIRED') { 
          this.submitLogin = false;
          this.authUser = loginUser;
          this.completeLoginForm = true;
          this.loginForm.reset({password: '', username: username});
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
        if(users != null && users.length != 0) {
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
