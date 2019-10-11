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

  constructor(private userService:UserService) { }

  ngOnInit() {
  }

  register(username: string, email: string, password: string) {
    var user = new User();
    user.name = username;
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

  cancel() {
    this.registered.emit(true);
  }

}
