import {Component, OnInit} from '@angular/core';
import {UiEventsService} from "./services/ui-events.service";
import {ClientService} from "./services/client.service";
import {MatDialog} from "@angular/material/dialog";
import {FingerprintDialogComponent} from "./components/dialogs/fingerprint-dialog/fingerprint-dialog.component";
import {AuthenticationService} from "./services/authentication.service";
import {UserService} from "./services/user.service";
import {FingerprintService} from "./services/fingerprint.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  currentState = 'pending';
  showFingerPrintButton = false;

  constructor(
    public uiEventsService: UiEventsService,
    public client: ClientService,
    public dialog: MatDialog,
    public userService: UserService,
    public authenticationService: AuthenticationService,
    public fingerPrintService: FingerprintService,
    private snackBar: MatSnackBar
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.uiEventsService.clientState.subscribe(state => {
      console.info("State changed to: " + state);
      this.currentState = ({
        idle: 'pending',
        signature: 'magic_button',
        request: 'http'
      })[state];
    });

    this.uiEventsService.signatureStatus.subscribe(status => {
      this.snackBar.open("Signature mismatch", "Logout")
        .afterDismissed()
        .subscribe(() => {
          console.info("Logout");
          this.authenticationService.logout();
        });
    });

    this.fingerPrintService.getFingerprint().subscribe(fingerprint => {
      this.authenticationService.verifySession();
      this.showFingerPrintButton = true;
    });
  }

  showFingerprint() {
    const dialogRef = this.dialog.open(FingerprintDialogComponent);
  }

  async ping() {
    this.client.ping().subscribe((data => console.log(data)));
  }
}
