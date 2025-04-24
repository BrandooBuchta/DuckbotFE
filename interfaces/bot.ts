export interface SignInRequest {
  name: string;
  password: string;
}

export interface SignUpRequest {
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
  welcomeMessage?: string;
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
