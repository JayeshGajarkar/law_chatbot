import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable} from 'rxjs';
import { User } from '../models/model';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  currUser!:User | null;
  private currUserSubject=new BehaviorSubject(this.currUser);
  currUserSubject$=this.currUserSubject.asObservable();

  constructor(private http:HttpClient){}

  signUp(user:User):Observable<any>{
    return this.http.post(`http://localhost:3000/user/signIn`,user);
  }

  sendOtpForSignUp(email:string):Observable<any>{
    return this.http.post(`http://localhost:3000/user/sendOtpForSignUp`,{email});
  }

  sendOtpForPassword(email:string):Observable<any>{
    return this.http.post(`http://localhost:3000/user/sendOtpForPassword`,{email});
  }

  verifyOtp(email:string,otp:string):Observable<any>{
    return this.http.post(`http://localhost:3000/user/verifyOtp`,{email,otp});
  }

  changePassword(user:Partial<User>):Observable<any>{
    return this.http.put(`http://localhost:3000/user/changePassword`,user);
  }

  logIn(user:User|null):Observable<any>{
    return this.http.post(`http://localhost:3000/user/logIn`,user);
  }

  logOut(){
    localStorage.removeItem('token');
    this.currUserSubject.next(null);
  }

  notifyLogIn(user:User){
    this.currUser=user;
    this.currUserSubject.next(user);
  }
  
  updateUser(userId:number,user:User):Observable<any>{
    return this.http.put(`http://localhost:3000/user/update/${userId}`,user)
  }

  deleteUser(userId:number):Observable<any>{
    return this.http.delete(`http://localhost:3000/user/delete/${userId}`)
  }
}
