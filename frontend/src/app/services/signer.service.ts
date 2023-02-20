import {Injectable} from '@angular/core';
import {HttpRequest} from "@angular/common/http";
import {FingerprintService} from "./fingerprint.service";
import {HttpLogsService} from "./http-logs.service";

@Injectable({
  providedIn: 'root'
})
export class SignerService {

  constructor(private fingerprintService: FingerprintService, private httpLogsService: HttpLogsService) {
  }

  public async sign(request: HttpRequest<unknown>): Promise<string> {
    console.info(request)
    const pathname = request.url.startsWith('/') ? request.url : new URL(request.url).pathname;
    const message = request.method
      + pathname
      + request.headers.get("RequestId")
      + request.body

    const signature = await this.signMessage(message);
    this.httpLogsService.pushLogData('Signing request', {
      message,
      signature
    });

    return signature;
  }

  public async signMessage(message: string): Promise<string> {
    const fingerprint = await this.fingerprintService.getVisitorId();
    return new Uint8Array(await this.hmacSha256(fingerprint, message))
      .reduce((s: string, b: number) => s + b.toString(16).padStart(2, '0'), '');
  }

  async hmacSha256(key: string, message: string): Promise<ArrayBuffer> {
    const hmacKey = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(key),
      {name: 'HMAC', hash: 'SHA-256'},
      true,
      ['sign']
    );

    return await crypto.subtle.sign('HMAC', hmacKey, new TextEncoder().encode(message));
  }
}
