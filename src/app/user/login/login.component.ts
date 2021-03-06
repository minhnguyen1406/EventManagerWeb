import { Component,  OnInit, ViewChild } from '@angular/core';
import { UserLoginModel } from '../../models/login.model';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginModel: UserLoginModel;
  isSubmitted = false;
  invalidCredential = null;

  @ViewChild("loginForm") loginForm: NgForm;


  constructor(private userService : UserService, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.loginModel = { username: undefined, password: undefined };
  }

  loginUser(event: any) {
    //validate yoru login
    if(this.isFormValid){
      this.isSubmitted = false;

      let loggedUser;

      this.userService.validateLogin(this.loginModel).subscribe(response => {
       
       loggedUser = response;
       sessionStorage.setItem('userToken', loggedUser.username);
       sessionStorage.setItem('token', loggedUser.token);
       sessionStorage.setItem('userId', loggedUser.id);
       this.authService.login();
       this.router.navigate(['/welcome']);
      }, error => {
        console.log("Error in authenticating user");
        this.invalidCredential = "User not exists!";
      });

    }else{
      this.isSubmitted = true;
    }
  
  }

  get isFormValid() {
    if (this.loginModel.username && this.loginModel.password)
      return true;
    else
      return false;
  }

  public canDeactivate(): boolean {
    if(this.loginForm.dirty){
      return false;
    }

    return true;
  }

}
