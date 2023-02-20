import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FingerprintService} from "../../../services/fingerprint.service";
import {editor} from "monaco-editor";
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;
import {MonacoInitializerService} from "../../../services/monaco-initializer.service";

//import * as monaco from 'monaco-editor';


@Component({
  selector: 'app-fingerprint-dialog',
  templateUrl: './fingerprint-dialog.component.html',
  styleUrls: ['./fingerprint-dialog.component.scss']
})
export class FingerprintDialogComponent implements OnInit, AfterViewInit {
  @ViewChild('editor') editor?: ElementRef<HTMLDivElement>;
  public userIdentifier: string = '';
  public fingerprint: string = '';

  constructor(
    private fingerprintService: FingerprintService,
    private monacoInitializer: MonacoInitializerService
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.userIdentifier = await this.fingerprintService.getVisitorId();

  }

  public async ngAfterViewInit(): Promise<void> {
    this.fingerprint = JSON.stringify(await this.fingerprintService.getFullFingerprintData(), null, 2);
    if (!this.editor) {
      return;
    }

    this.monacoInitializer.initWithModel('app://fingerprint.json', 'json', this.editor.nativeElement, this.fingerprint).subscribe();
  }
}
