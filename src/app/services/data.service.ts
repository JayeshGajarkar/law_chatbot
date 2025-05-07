import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from '../models/model';

@Injectable({
  providedIn: 'root'
})


export class DataService {

  constructor(private http:HttpClient) { }

  private messages:Message[]=[];
  private history:Message[][]=[];

  getResponce(msg:string):Observable<any>{
    return this.http.post<any>('http://127.0.0.1:8000/chat', { message: msg });
  }

  getMessages(){
    return this.messages;
  }

  addMessage(message:Message){
    this.messages.push(message);
    console.log(this.messages)
  }

  getHistory(){
    return this.history;
  }

  resetMessages(){
    this.messages.splice(0,this.messages.length);
  }
  
  newChat(){
    this.history.push([...this.messages]);
    this.resetMessages();
  }

  openSection(index:number){
    this.messages=this.history[index];
  }

  deleteSection(index:number){
    this.history.splice(index,1);
  }
}
