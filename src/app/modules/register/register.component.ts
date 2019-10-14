import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { User } from '../../data-models/user/user';
import { UserService } from '../../data-models/user/user.service';
import { FormControl, Validators } from '@angular/forms'
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() registered = new EventEmitter();
  formComplete = false;
  hide = true;
  email = new FormControl('', [Validators.required, Validators.email]);

  constructor(
    private userService:UserService,
    private snackBar:MatSnackBar) { }

  ngOnInit() {
  }

  register(username: string, email: string, password: string) {
    if(this.formComplete) { 
      var user = new User();
      user.user_name = username;
      user.email = email;
      user.password = password;

      this.userService.register(user).subscribe((success) =>{
        if(success) {
          this.snackBar.open("register successful", '', {duration:3000});
          this.registered.emit(success);
        } else {
          this.snackBar.open("register error",'', {duration:3000});
        }
      });
    }
  }

  disableRegisterButton(username, ln, fn, email, password, password2):boolean {
    if(username == '' || ln == '' || fn == '' || email == '' || password == '' || password2 == '') {
      this.formComplete = false;
      return true;
    } else {
      this.formComplete = password2 == password;
      return password2 != password;
    }
  }

  cancel() {
    this.registered.emit(true);
  }

  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
        this.email.hasError('email') ? 'Not a valid email' :
            '';
  }

}
