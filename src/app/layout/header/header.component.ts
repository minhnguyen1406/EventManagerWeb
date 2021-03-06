import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { UserModel } from 'src/app/models/user.model';
import { AuthService } from '../../user/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  isAdmin = false;
  timespan: string;
  userId : number;
  timer = interval(1000); //create an observable

  timerSubscription: Subscription;
  userLoginSubscription: Subscription;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.isAdmin = this.authService.isAdmin();
    this.userId = this.authService.getLoggedUserId();
    this.userLoginSubscription = this.authService.isUserLogged.subscribe((val) => {
      this.isAuthenticated = val;
      this.isAdmin = this.authService.isAdmin();
      this.userId = this.authService.getLoggedUserId();
    });
    this.timerSubscription = this.timer.subscribe(() => {
      this.timespan = new Date().toLocaleTimeString();
    });
  }

  logout(event: any) {
    this.authService.signout();
    this.router.navigate(['login']);
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    if (this.userLoginSubscription) {
      this.userLoginSubscription.unsubscribe();
    }
  }

}
