import {Injectable} from '@angular/core';
import fp, {Agent, GetResult} from "@fingerprintjs/fingerprintjs";
import {BehaviorSubject, filter, Observable} from "rxjs";

export interface FingerprintData {
  fingerprint: GetResult;
  visitorId: string;
}

@Injectable({
  providedIn: 'root'
})
export class FingerprintService {
  private fpData: GetResult | null = null;
  private result: BehaviorSubject<FingerprintData | null> = new BehaviorSubject<FingerprintData | null>(null)

  constructor() {
    fp.load({monitoring: false})
      .then((fp: Agent) => fp.get())
      .then((result: GetResult) => {
        this.fpData = result;
        this.result.next({
          fingerprint: result,
          visitorId: result.visitorId
        });
        console.log(result);
      });
  }

  public async getVisitorId(): Promise<string> {
    if (this.fpData === null) {
      throw new Error("Fingerprint not loaded yet");
    }

    return this.fpData.visitorId;
  }

  public getFullFingerprintData(): GetResult {
    if (this.fpData === null) {
      throw new Error("Fingerprint not loaded yet");
    }

    return this.fpData;
  }

  public getFingerprint(): Observable<FingerprintData> {
    return this.result.pipe(filter((result) => result !== null)) as Observable<FingerprintData>;
  }

  private getAdblockEnabled(): boolean {
    // @ts-ignore
    return (getComputedStyle(document.getElementById("detect"))["display"] == "none");
  }
}
