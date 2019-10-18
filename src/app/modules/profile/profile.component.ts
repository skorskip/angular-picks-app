import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/data-models/user/user';
import { UserService } from 'src/app/data-models/user/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user = new User();
  editSelected = false;

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.user = this.userService.currentUser;
  }

  editUser() {
    this.editSelected = true;
  }

  updated() {
    this.editSelected = false;
  }

}
