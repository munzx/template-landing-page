import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  error: boolean = false;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {}

  onSubmit(form: NgForm){
    this.http.post('/api/admin/login', form.value).subscribe(data=>{
      this.router.navigate(['admin']);
    }, err=>{
      console.log(err);
      this.error = true;
    });
  }
}