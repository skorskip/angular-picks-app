import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { User } from '../../data-models/user/user';
import { UserService } from '../../data-models/user/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() registered = new EventEmitter();
  formComplete = false;

  constructor(private userService:UserService) { }

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
          this.registered.emit(success);
        } else {
          console.log("ERROR");
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

}
