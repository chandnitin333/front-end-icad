import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [UserService]

})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(private auth: UserService, private router: Router) {

  }

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['admin']);
    }
  }
  onSubmit(): void {
    
    this.auth.checkAuth(this.loginForm.value).subscribe((data:any)=>{
        console.log(data)
        if(data?.statusCode==200){
          localStorage.setItem('user_token', JSON.stringify({ token: data?.token }))
          this.router.navigate(['admin']);
        }else{
          alert("Authentication failed , Please try again. "+data.error);
        }
    })

  
  }
}
