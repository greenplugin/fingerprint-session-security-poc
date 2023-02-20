import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {User} from "./data-models/user";
import {ClientService} from "./client.service";
import {AuthenticationService} from "./authentication.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly userProfile: BehaviorSubject<User | null | undefined> = new BehaviorSubject<User | null | undefined>(undefined);

  public logout() {
    this.userProfile.next(null);
  }

  public login(user: User) {
    this.userProfile.next(user);
  }

  public getProfile(): Observable<User | null | undefined> {
    return this.userProfile.asObservable();
  }
}
