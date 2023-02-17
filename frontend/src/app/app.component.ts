import {Component, OnInit} from '@angular/core';
import fp from '@fingerprintjs/fingerprintjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'frontend';

  async ngOnInit(): Promise<void> {
    fp.load()
      .then((fp) => fp.get())
      .then((result) => {
        console.log(result);
      });
  }
}
