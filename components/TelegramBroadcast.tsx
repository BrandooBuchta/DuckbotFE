"use client";

import { FC, useEffect, useRef, useState } from "react";
import { Button, Card, PinInput, Text } from "@mantine/core";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

import MarkdownTextarea from "./MarkdownTextarea";

import { api } from "@/utils/api";
import useBotStore from "@/stores/bot";

const prefixMap = {
  cs: "420",
  sk: "421",
  esp: "34",
  en: "1",
};

const TelegramBroadcast: FC = () => {
  const [isClient, setIsClient] = useState(false);
  const { bot } = useBotStore();

  const [phone, setPhone] = useState("");
  const [phonePrefix, setPhonePrefix] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [authStep, setAuthStep] = useState<"phone" | "code" | "done">("phone");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [session, setSession] = useState<string | null>(null);
  const [phoneCodeHash, setPhoneCodeHash] = useState<string | null>(null);
  const [startSession, setStartSession] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setIsClient(true);
    const storedSession = Cookies.get("telegram_session");

    if (storedSession) {
      setSession(storedSession);
      setAuthStep("done");
    }
  }, []);

  useEffect(() => {
    const lang = bot?.lang && prefixMap[bot.lang];

    lang && setPhonePrefix(lang);
  }, [bot?.lang]);

  const sendPhone = async () => {
    setIsSubmitting(true);
    try {
      const res = await api.post("/telegram/start", {
        phone: `+${phonePrefix}${phone}`,
      });

      setPhoneCodeHash(res.data.phoneCodeHash);
      setStartSession(res.data.session);
      setAuthStep("code");
      toast.success("Kód odeslán");
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Chyba při odeslání kódu");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmCode = async () => {
    if (!phoneCodeHash || !startSession) {
      toast.error("Chybí session nebo phoneCodeHash.");

      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post("/telegram/confirm", {
        phone: `+${phonePrefix}${phone}`,
        code,
        phoneCodeHash,
        session: startSession,
      });

      const newSession = res.data.session;

      Cookies.set("telegram_session", newSession, {
        expires: 14,
        secure: true,
        sameSite: "Lax",
      });

      setSession(newSession);
      setAuthStep("done");
      toast.success("Autentizace úspěšná");
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Nepodařilo se přihlásit");
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendBroadcast = async () => {
    if (!session) {
      toast.error("Chybí session – přihlas se prosím znovu.");

      return;
    }

    setIsSending(true);
    try {
      const formData = new FormData();

      formData.append("session", session);
      formData.append("message", message);
      formData.append("lang", bot?.lang || "cs");
      if (file) {
        console.log("file: ", file);
        formData.append("file", file);
      }

      await api.post("/telegram/broadcast", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Zprávy odeslány");
      setMessage("");
      setFile(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Chyba při odesílání");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="w-fit mx-auto mt-32">
      {authStep === "phone" && (
        <Card withBorder radius="md" shadow="sm">
          <Text fw="bold" size="xl">
            Zadej své telefonní číslo | +420 XXX XXX XXX
          </Text>
          <div className="flex items-center text-3xl">
            <p className="mr-2">+</p>
            <PinInput
              className="my-4"
              length={3}
              type="number"
              value={phonePrefix}
              onChange={(e) => setPhonePrefix(e)}
            />
            <p className="mx-2">-</p>
            <PinInput
              className="my-4"
              length={9}
              type="number"
              value={phone}
              onChange={(e) => setPhone(e)}
            />
          </div>
          <Button fullWidth loading={isSubmitting} onClick={sendPhone}>
            Odeslat kód
          </Button>
        </Card>
      )}

      {authStep === "code" && (
        <Card withBorder radius="md" shadow="sm">
          <Text className="text-center" fw="black" size="lg">
            Zadej ověřovací kód z Telegramu
          </Text>
          <PinInput
            className="my-4 mx-auto"
            length={5}
            type="number"
            value={code}
            onChange={(e) => setCode(e)}
          />
          <Button fullWidth loading={isSubmitting} onClick={confirmCode}>
            Přihlásit se
          </Button>
        </Card>
      )}

      {authStep === "done" && (
        <Card withBorder className="lg:w-[600px]" radius="md" shadow="sm">
          <Text className="mb-3 font-semibold">
            Hromadná zpráva na Telegram kontakty
          </Text>
          <MarkdownTextarea
            className="mb-4"
            value={message}
            onChange={(v) => setMessage(v)}
          />
          <input
            ref={fileInputRef}
            hidden
            accept="image/*,video/*"
            type="file"
            onChange={(e) => {
              const selected = e.target.files?.[0];

              if (selected) {
                setFile(selected);
                toast.info(`Vybrán soubor: ${selected.name}`);
              }
            }}
          />
          <div className="mb-3">
            {file && (
              <Text className="mb-1" size="sm">
                Vybraný soubor: <b>{file.name}</b>
              </Text>
            )}
            <Button
              className="mr-2"
              onClick={() => fileInputRef.current?.click()}
            >
              Nahrát fotku/video
            </Button>
            {file && (
              <Button color="red" variant="light" onClick={() => setFile(null)}>
                Odebrat soubor
              </Button>
            )}
          </div>
          <Button loading={isSending} onClick={sendBroadcast}>
            Odeslat zprávu
          </Button>
        </Card>
      )}
    </div>
  );
};

export default TelegramBroadcast;
