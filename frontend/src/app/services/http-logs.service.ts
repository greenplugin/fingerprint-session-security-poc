import {EventEmitter, Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

export interface LogLine {
  dateTime: Date;
  message: string;
  data: any;
}

@Injectable({
  providedIn: 'root'
})
export class HttpLogsService {
  private readonly logData: LogLine[] = [];
  logLines: BehaviorSubject<LogLine[]> = new BehaviorSubject<LogLine[]>([])

  constructor() {
    this.logData = JSON.parse(localStorage.getItem('logData') || '[]');
  }

  pushLogData(message: string, data: any) {
    this.logData.push({message, data, dateTime: new Date()});
    if (this.logData.length > 20) {
      this.logData.shift();
    }

    this.logLines.next(this.logData);

    localStorage.setItem('logData', JSON.stringify(this.logData));
  }
}
