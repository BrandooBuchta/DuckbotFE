export interface Link {
  id: string;
  botId: string;
  parent: string;
  child: string;
  position: number;
  share: number;
  currentlyAssigned: number;
}

export interface UpdateLink {
  parent?: string;
  child?: string;
  share?: number;
  position?: number;
}
