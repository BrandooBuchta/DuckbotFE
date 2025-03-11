export interface FAQ {
  id: string;
  botId: string;
  parent: string;
  child: string;
  position: number;
}

export interface UpdateFAQ {
  parent?: string;
  child?: string;
  position?: number;
}
