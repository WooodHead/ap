export interface CallsHistory {
  call_id: string;
  datetime: Date;
  agentId: string;
  duration: number;
  callerNumber: string;
  type: string;
}
