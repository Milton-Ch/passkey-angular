import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { Fido2Service } from './fido2.service';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

declare const webauthn: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatButtonModule, HttpClientModule, MatInputModule, MatIconModule, FormsModule, MatRadioModule, MatSelectModule],
  providers: [Fido2Service],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  attestation1!: string;
  attestation2!: string;
  attestation3!: string;
  attestationError!: string;

  assertion1!: string;
  assertion2!: string;
  assertion3!: string;
  assertionError!: string;


  public email = '';
  public name = '';

  userVerificationList = ['discouraged', 'preferred', 'required'];
  selectedUserVerification = 'discouraged';
  selectedUserVerificationAssertion = 'discouraged';
  selectedResidentKey = 'discouraged';

  constructor(private fido2Service: Fido2Service) { }

  onRegister() {
    this.cleanAttestation();
    this.fido2Service.attestationOptions({
      "attestation": "direct",
      "displayName": this.name,
      "username": this.email,
      "authenticatorSelection": {
        "requireResidentKey": true,
        "residentKey": this.selectedResidentKey,
        "userVerification": this.selectedUserVerification
      },
      "excludeCredentials": [],
      "timeout": 90000,
      "extensions": {
        "credProps": true
      }
    }).subscribe({
      next: (next => {
        const body = next.body;
        this.attestation1 = JSON.stringify(body);
        webauthn.createCredential(body)
          .then((data: any) => {
            const dataObject = webauthn.responseToObject(data);
            this.attestation2 = JSON.stringify(dataObject);
            this.fido2Service.attestationResult(dataObject)
              .subscribe({
                next: (next => {
                  this.attestation3 = JSON.stringify(next.body);
                }),
                error: (err => {
                  this.attestationError = JSON.stringify(err);
                })
              })
          })
          .catch((err: any) => {
            this.attestationError = JSON.stringify(err);
            console.error('Failed to get attestation: ' + this.attestationError);
          });
      }),
      error: (err => {
        this.attestationError = JSON.stringify(err);
        console.error('Failed on options: ' + this.attestationError);
      })
    });
  }

  onSignIn() {
    this.cleanAssertion();
    this.fido2Service.assertionOptions({
      username: this.email,
      timeout: 90000,
      userVerification: this.selectedUserVerificationAssertion
    }).subscribe({
        next: (next => {
          const body = next.body;
          delete body.allowCredentials;
          this.assertion1 = JSON.stringify(body);
          webauthn.getAssertion(body)
            .then((data: any) => {
              const dataObject = webauthn.responseToObject(data);
              this.assertion2 = JSON.stringify(dataObject);
              this.fido2Service.assertionResult(dataObject)
                .subscribe({
                  next: (next) => {
                    this.assertion3 = JSON.stringify(next.body);
                  },
                  error: (err) => {
                    this.assertionError = JSON.stringify(err)
                  }
                })
            })
            .catch((err: any) => {
              this.assertionError = JSON.stringify(err)
            });
        }),
        error: (err => {
          this.assertionError = JSON.stringify(err)
        })
      });
  }

  cleanAttestation() {
    this.attestation1 = '';
    this.attestation2 = '';
    this.attestation3 = '';
    this.attestationError = '';
  }

  cleanAssertion() {
    this.assertion1 = '';
    this.assertion2 = '';
    this.assertion3 = '';
    this.assertionError = '';
  }
}
