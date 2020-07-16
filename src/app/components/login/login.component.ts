import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/authentication.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {

    this.loginForm = new FormGroup(
      {
        username: new FormControl(''),
        password: new FormControl('')
      }
    );

  }

  submit(): void {

    this.authService.loginRequest(this.loginForm.get('username').value, this.loginForm.get('password').value);
  }
}
