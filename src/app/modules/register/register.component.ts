import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { User } from '../../data-models/user/user';
import { UserService } from '../../data-models/user/user.service';
import { FormControl, Validators, FormBuilder } from '@angular/forms'
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Input() editUser = false;
  @Output() registered = new EventEmitter();

  user = new User();
  hide = true;
  formType = "register";
  errorMessage = "";
  editUserForm;

  constructor(
    private userService:UserService,
    private snackBar:MatSnackBar,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService) { 
      this.user = this.authService.currentUserValue;
      this.editUserForm = this.formBuilder.group({
        firstName: this.user.first_name,
        lastName: this.user.last_name,
        username: this.user.user_name,
        email: new FormControl(this.user.email, [Validators.required, Validators.email]),
        currentPassword: '',
        password: '',
        confirmPassword: ''
      })
    }

  ngOnInit() {
    if(this.editUser) {
      this.formType = "update";
    }
  }

  submit(form) {
    if(this.formComplete(form)) {
      var newUser = this.userService.setCurrentUser(form.firstName, form.lastName, form.username, form.email, form.password);
      if(this.editUser) {
        this.updateUser(newUser);
      } else {
        this.registerUser(newUser);
      }
    } else {
      this.snackBar.open(this.errorMessage,'', {duration:3000});
    }
  }

  updateUser(user: User) {

    this.userService.update(user).subscribe((success) =>{
      if(success) {
        this.snackBar.open("update successful", '', {duration:3000});
        this.registered.emit(success);
      } else {
        this.snackBar.open("update error",'', {duration:3000});
      }
    });
  }

  registerUser(user: User) {
    this.userService.register(user).subscribe((success) =>{
      if(success) {
        this.snackBar.open("register successful", '', {duration:3000});
        this.registered.emit(success);
      } else {
        this.snackBar.open("register error",'', {duration:3000});
      }
    });
  }

  formComplete(form):boolean {
    if(this.editUser) {
      if(form.password != '' || form.confirmPassword != '' || form.currentPassword != '') {
        if(form.password == form.confirmPassword) {
            return true;
        } else {
          this.errorMessage = "new passwords do not match"
          return false;
        }
      } else {
        return true;
      }
    } else {
      if(form.username == '' || form.lastName == '' || form.firstName == '' || form.email == '' || form.password == '' || form.confirmPassword == '') {
        this.errorMessage = "missing fields"
        return false;
      } else {
        if(form.password == form.confirmPassword) {
          return true;
        } else {
          this.errorMessage = "new passwords do not match"
          return false;
        }
      }
    }
  }

  cancel() {
    this.registered.emit(true);
  }

  getErrorMessage() {
    return 'Not a valid email';
  }

}
