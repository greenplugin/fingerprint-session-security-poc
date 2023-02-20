import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {ClientService} from "../../services/client.service";
import {FingerprintService} from "../../services/fingerprint.service";
import {AuthenticationService} from "../../services/authentication.service";
import {User} from "../../services/data-models/user";
import {Subscription} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {FingerprintDialogComponent} from "../dialogs/fingerprint-dialog/fingerprint-dialog.component";
import {LoginDialogComponent} from "../dialogs/login-dialog/login-dialog.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  profile: User | null | undefined
  private profileSubscription?: Subscription;

  constructor(
    public userService: UserService,
    private client: ClientService,
    private authenticationService: AuthenticationService,
    public dialog: MatDialog,
  ) {
  }

  ngOnDestroy(): void {
    if (this.profileSubscription) this.profileSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.profileSubscription = this.userService.getProfile().subscribe(profile => this.profile = profile);
  }

  async login() {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      data: {name: ""}
    });

    dialogRef.afterClosed().subscribe((result: { name: string }) => {
      if (!result) {
        return;
      }
      console.info("Login dialog closed with result: " + result.name)
      return this.authenticationService.login(result.name)
    });
  }

  async verify() {
    this.client.verifySession().subscribe((data => console.log(data)));
  }

  async ping() {
    this.client.ping().subscribe((data => console.log(data)));
  }

  async logout() {
    this.authenticationService.logout()
  }
}
