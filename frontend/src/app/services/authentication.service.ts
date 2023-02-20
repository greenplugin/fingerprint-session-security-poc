import {Injectable} from '@angular/core';
import {ClientService} from "./client.service";
import {User} from "./data-models/user";
import {UserService} from "./user.service";
import {FingerprintService} from "./fingerprint.service";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(
    private clientService: ClientService,
    private userService: UserService,
    private fingerprintService: FingerprintService,
    private fingerPrintService: FingerprintService,
  ) {

  }

  verifySession() {
    this.fingerprintService.getVisitorId()
    this.clientService.verifySession().subscribe((user: User) => {
      this.userService.login(user);
    });
  }

  logout() {
    localStorage.removeItem("sessionToken");
    this.verifySession();
  }

  async login(name: string = 'John Doe') {
    this.clientService.issueSession(
      name,
      await this.fingerPrintService.getVisitorId(),
      this.fingerPrintService.getFullFingerprintData(),
      `/assets/avatars/${this.getRandomInt(1, 26)}.png`
    ).subscribe((data => {
      localStorage.setItem("sessionToken", data.token);
      this.verifySession();
    }));
  }

  getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }
}
