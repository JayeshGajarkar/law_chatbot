import { Component, ViewChild, ElementRef, OnInit, NgZone } from '@angular/core';
import { Message } from '../models/model';
import { DataService } from '../services/data.service';
import { take } from 'rxjs';
import { SidebarModule } from 'primeng/sidebar';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone:false
})
export class DashboardComponent implements OnInit{

  @ViewChild('chatBox') chatBox!: ElementRef;
  userMessage: string = '';
  messages!: Message[];
  history:Message[][]=[];
  isTyping: boolean = false;
  botMessage: string = '';
  botTextIndex: number = 0;
  sidebarVisible: boolean = false;

  constructor(private dataService: DataService,private zone: NgZone) {}

  ngOnInit(){
    this.messages=this.dataService.getMessages();
    this.history=this.dataService.getHistory();
  }

  sendMessage() {
    if (this.userMessage.trim()) {
      this.dataService.addMessage({ text: this.userMessage, user: true });
      const userQuery = this.userMessage;
      this.userMessage = '';
      this.scrollToBottom();
      this.isTyping = true;

      this.dataService.getResponce(userQuery).pipe(take(1)).subscribe(
        (data) => {
          this.botMessage = data.response;
          this.dataService.addMessage({ text:'', user: false }); 
          this.botTextIndex = 0;
          this.animateBotResponse();
          // console.log(this.messages);
        },
        (error) => {
          console.error(error);
          this.isTyping = false;
        }
      );
    }
  }

  animateBotResponse() {
    const interval = setInterval(() => {
      if (this.botTextIndex < this.botMessage.length) {
        this.messages[this.messages.length - 1].text = this.botMessage.substring(0, this.botTextIndex + 1);
        this.botTextIndex++;
        this.scrollToBottom();
      } else {
        clearInterval(interval);
        this.isTyping = false;
      }
    }, 25);
  }

  scrollToBottom() {
    setTimeout(() => {
      try {
        this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
      } catch (err) {}
    }, 100);
  }

  resetChat(){
    this.dataService.resetMessages();
  }
   

  recognition = new (webkitSpeechRecognition || SpeechRecognition)();

  startListening() {
    this.recognition.lang = 'en-US';
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      this.zone.run(() => {
        this.userMessage = event.results[0][0].transcript;
        // console.log('Transcript:', this.userMessage);
      });
    };

    this.recognition.onerror = (event: any) => {
      console.error('Error occurred in recognition:', event.error);
    };

    this.recognition.onend = () => {
      console.log('Speech recognition service disconnected');
      // console.log("usermessage:",this.userMessage);
    };

    this.recognition.start();

  }

  newChat(){
    this.dataService.newChat();
  }

  openSection(index:number){
    this.dataService.openSection(index);
    this.messages=this.dataService.getMessages();
  }

  deleteSection(index:number){
    this.dataService.deleteSection(index);
  }

  
  
}
