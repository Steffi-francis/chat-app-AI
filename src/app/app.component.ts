import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { environment } from '../environments/environment';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

@Component({
  selector: 'app-root',
  imports: [CommonModule,FormsModule,MatToolbarModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatIconModule,
  MatProgressSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'AI Chat';
   messages: Message[] = [
    { role: 'ai', text: 'Hi! How can I help you today?' }
  ];
  userInput: string = '';
constructor(private http: HttpClient) {}
  send() {
  if (!this.userInput.trim()) return;

  this.messages.push({
    role: 'user',
    text: this.userInput
  });

  this.userInput = '';
    const headers = new HttpHeaders({
    'x-api-key': environment.apiKey,
    'anthropic-version': '2023-06-01',
    'content-type': 'application/json',
    'anthropic-dangerous-direct-browser-access': 'true'
  });

  const body = {
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    system: 'You are a helpful AI assistant.',
    messages: this.messages.map(m => ({
      role: m.role === 'ai' ? 'assistant' : 'user',
      content: m.text
    }))
  };

  this.http.post<any>(
    'https://api.anthropic.com/v1/messages',
    body,
    { headers }
  ).subscribe(response => {
    this.messages.push({
      role: 'ai',
      text: response.content[0].text
    });
  });

}

onKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    this.send();
  }
}

}