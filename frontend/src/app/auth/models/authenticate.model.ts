export interface Authenticate {
  agent: string;
  extension: number;
  useWebRTC?: boolean;
  secret?: string;
  force?: boolean;
}
