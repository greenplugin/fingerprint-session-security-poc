export interface Session {
  token: string;
  name: string;
  avatarImageUrl: string | null;
  fingerprintData: unknown;
  fingerprint: string;
}
