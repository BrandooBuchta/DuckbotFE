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
  videoUrl: string;
  isEvent: boolean;
  eventCapacity: 0;
  eventDate: string;
  eventLocation: string;
  domain: string | null;
  videos: string[];
  eventName: string;
  lang: "cs" | "sk" | "en" | "esp";
}

export interface BotStatistic {
  value: number;
  title: string;
  isRatio: boolean;
  change: number;
}
export type CMS = Partial<Bot>;

export interface DomainConfig {
  configuredBy: any;
  nameservers: string[];
  serviceType: string;
  cnames: any[];
  aValues: any[];
  conflicts: any[];
  acceptedChallenges: any[];
  misconfigured: boolean;
  recommendedIPv4: RecommendedIpv4[];
  recommendedCNAME: RecommendedCname[];
}

export interface RecommendedIpv4 {
  rank: number;
  value: string[];
}

export interface RecommendedCname {
  rank: number;
  value: string;
}
