export interface Sequence {
  id: string;
  botId: string;
  name: string;
  message: string;
  position: number;
  sendAt: Date;
  startsAt?: Date | null | string;
  interval: number;
  repeat: boolean;
  sendImmediately: boolean;
  levels: string[];
  isActive: boolean;
  checkStatus: boolean;
}

export interface UpdateSequence {
  name?: string;
  message?: string;
  sendAt?: Date | null;
  startsAt?: Date | null | string;
  interval?: number;
  position?: number;
  repeat?: boolean;
  sendImmediately?: boolean;
  levels?: string[];
  isActive?: boolean;
  checkStatus?: boolean;
}
