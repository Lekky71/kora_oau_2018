import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {SignupResponse} from '../models/signup_res';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  urls = {
    signup: '/api/auth/signup',
    login: '/api/auth/login'
  };
  loggedIn: boolean;

  constructor(private http: HttpClient, private router: Router) {
  }

  isLoggedIn() {
    return this.loggedIn;
  }

  signUp(credentials) {
    return this.http.post<SignupResponse>(this.urls.signup, credentials).pipe(
      map(response => {
        if (!response.signUpErrors) {
          this.loggedIn = true;
          return true;
        }
        return false;
      }));
  }

  login(credentials) {
    return this.http.post<SignupResponse>(this.urls.login, credentials).pipe(
      map(response => {
        if (response.logInErrors[0] === 'correct') {
          console.log(response);
          this.loggedIn = true;
          return true;
        }
        return false;
      }));
  }
}
