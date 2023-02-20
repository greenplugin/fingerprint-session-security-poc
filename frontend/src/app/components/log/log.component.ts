import {AfterContentInit, AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MonacoInitializerService} from "../../services/monaco-initializer.service";
import {HttpLogsService, LogLine} from "../../services/http-logs.service";
import {editor} from "monaco-editor";
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss']
})
export class LogComponent implements AfterViewInit, OnInit {
  @ViewChild('logsEditor') logsEditor: ElementRef | undefined;
  selectedLog: string = 'Select log to display';
  private monaco: IStandaloneCodeEditor | undefined;
  public selectedLogIndex: number | undefined;
  public logLines: LogLine[] = [];

  constructor(
    private monacoInitializer: MonacoInitializerService,
    private logsService: HttpLogsService
  ) {
  }


  ngOnInit(): void {
    this.logsService.logLines.subscribe((logLines: any[]) => {
      this.logLines = Array.from(logLines).reverse();
    })
  }

  ngAfterViewInit(): void {
    if (!this.logsEditor) {
      return;
    }

    this.monacoInitializer.initWithModel('app://log.json', 'json', this.logsEditor.nativeElement, this.selectedLog)
      .subscribe((monaco: IStandaloneCodeEditor) => {
        this.monaco = monaco
      });

  }


  selectLog(index: number) {
    this.selectedLogIndex = index;
    this.selectedLog = JSON.stringify(this.logLines[index], null, 2);
    if (this.monaco) {
      this.monaco.setValue(this.selectedLog);
      this.monaco.getAction('editor.action.formatDocument')?.run();
    }
  }

}
