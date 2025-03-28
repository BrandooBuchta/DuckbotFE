export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  email: string;
  name: string;
  eventName: string;
  password: string;
  token: string;
  isEvent: boolean;
}

export interface SignInResponse {
  token: string;
  bot: Bot;
}

export interface Bot {
  id: string;
  name: string;
  email: string;
  welcomeMessage?: string;
  devsCurrentlyAssigned: number;
  devsShare: number;
  supportContact?: string;
  videoUrl: string;
  isEvent: boolean;
  eventCapacity: 0;
  eventDate: string;
  eventLocation: string;
  eventName: string;
  lang: "cs" | "sk" | "en" | "esp";
}

export interface BotStatistic {
  value: number;
  title: string;
}
export type CMS = Partial<Bot>;
