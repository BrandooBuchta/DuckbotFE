import { Dayjs } from "dayjs";

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  email: string;
  name: string;
  password: string;
  token: string;
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
  devscurrentlyAssigned: number;
  devsShare: number;
  startMessage?: string;
  helpMessage?: string;
  supportContact?: string;
}

export interface UpdateBot {
  name?: string;
  welcomeMessage?: string;
  startMessage?: string;
  helpMessage?: string;
  supportContact?: string;
}

export interface PlainBot {
  name: string;
  welcomeMessage: string;
  startMessage: string;
  helpMessage: string;
  supportContact: string;
}

export interface BotStatistic {
  value: number;
  label: string;
  desc: string;
}
