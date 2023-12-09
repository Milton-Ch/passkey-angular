import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { Fido2Service } from './fido2.service';

declare const webauthn: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatButtonModule, HttpClientModule],
  providers: [Fido2Service],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  constructor(private fido2Service: Fido2Service) { }

  ngOnInit() {
  }

  onSignIn() {
    this.fido2Service.options('milton1')
      .subscribe({
        next: (next => {
          console.log(next.body);
          const stringRequest = JSON.stringify(next.body);
          webauthn.getAssertion(stringRequest)
            .then((data: any) => {
              console.info('Get assertion completed: ' + JSON.stringify(webauthn.responseToObject(data)));
              // setStatus("Please wait...");
              // document.getElementById("tokenResponse").value = JSON.stringify(webauthn.responseToObject(data))
              // document.forms[0].submit()
            })
            .catch((err: any) => {
              console.error('Failed to get assertion: ' + JSON.stringify(err));
              // let name = err.name
              // setStatus("")
              // let message = ""
              //
              // if (name === "NotAllowedError") {
              //   //Credential not recognized.
              //   message = "Please use a fido credential already associated to your account"
              // } else if (name === "AbortError") {
              //   message = "Operation was cancelled"
              // } else {
              //   message = "An error occurred"
              //
              //   if (err.message) {
              //     console.log(err.message)
              //   } else if (err.messages) {
              //     console.log(err.messages)
              //   }
              // }
              // console.log(name)
              // setError(message)
              // document.getElementById("retry").style.display = "block"
            });
        }),
        error: (err => {
          console.error('Failed on options: ' + JSON.stringify(err));
        })
      });
  }
}
