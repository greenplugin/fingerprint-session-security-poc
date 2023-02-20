import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";
import {User} from "./data-models/user";

@Injectable({
  providedIn: 'root'
})
export class UiEventsService {
  public readonly clientState: BehaviorSubject<'idle' | 'signature' | 'request'> = new BehaviorSubject<'idle' | 'signature' | 'request'>('idle');
  public readonly signatureStatus: Subject<boolean> = new Subject<boolean>();

  constructor() {
  }
}
