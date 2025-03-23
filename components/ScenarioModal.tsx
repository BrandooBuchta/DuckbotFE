// components/ScenarioModal.tsx
import { FC, useState } from "react";
import { Modal } from "@mantine/core";

type Lang = "cs" | "en" | "esp" | "sk";

interface ScenarioModalProps {
  lang: Lang;
}

const scenarioContent: Record<Lang, string[]> = {
  cs: [
    "Správný čas, správné místo\nNic se neděje náhodou, získej ZDARMA záznam z Webináře\nA buď tentokrát na správném místě, ve správný čas...",
    "Právě teď pro tebe máme exkluzivní záznam z webináře, kde ti odhalíme příležitost této dekády! 🕐🦆",
    "Doposud 1-7 % měsíční výnosy 💰 a více než 1200 % zhodnocení aktiva 📈 – a to je teprve začátek! 💸",
    "Důkazy, místo slibů. Podívej se na zkušenosti dosavadních klientů! 🤩",
    "Jediné co proto musíš udělat je napsat našemu Telegramovému Botovi a ten ti ihned odešle záznam! 🎟️",
    "Klikni na tlačítko pod videem, dokud tady ta možnost je!",
  ],
  en: [
    "Right time, right place\nNothing happens by accident – get the FREE webinar recording\nAnd this time, be in the right place at the right time...",
    "Right now, we have an exclusive webinar recording for you where we reveal the opportunity of this decade! 🕐🦆",
    "So far, 1-7% monthly returns 💰 and over 1200% asset appreciation 📈 – and this is just the beginning! 💸",
    "Proof, not promises. See the experiences of our current clients! 🤩",
    "All you need to do is message our Telegram Bot and it’ll instantly send you the recording! 🎟️",
    "Click the button below the video while this offer is still available!",
  ],
  esp: [
    "El momento adecuado, el lugar adecuado\nNada pasa por casualidad – obtén la grabación del seminario GRATIS\nY esta vez, estarás en el lugar correcto, en el momento adecuado...",
    "Ahora mismo tenemos una grabación exclusiva del seminario para ti, donde revelamos la oportunidad de esta década! 🕐🦆",
    "Hasta ahora, rendimientos mensuales del 1-7% 💰 y más de 1200% de revalorización del activo 📈 – ¡y esto es solo el comienzo! 💸",
    "Pruebas en lugar de promesas. ¡Mira las experiencias de nuestros clientes! 🤩",
    "Todo lo que tienes que hacer es enviar un mensaje a nuestro Bot de Telegram ¡y te enviará la grabación al instante! 🎟️",
    "¡Haz clic en el botón debajo del video mientras esta opción aún esté disponible!",
  ],
  sk: [
    "Správny čas, správne miesto\nNič nie je náhoda – získaj ZADARMO záznam z webinára\nA tentokrát buď na správnom mieste, v správny čas...",
    "Práve teraz pre teba máme exkluzívny záznam z webinára, kde ti odhalíme príležitosť tejto dekády! 🕐🦆",
    "Doposiaľ 1-7 % mesačné výnosy 💰 a viac než 1200 % zhodnotenie aktíva 📈 – a toto je len začiatok! 💸",
    "Dôkazy namiesto sľubov. Pozri si skúsenosti doterajších klientov! 🤩",
    "Stačí napísať nášmu Telegramovému Botovi a ten ti hneď pošle záznam! 🎟️",
    "Klikni na tlačid lo pod videom, kým je táto možnosť stále dostupná!",
  ],
};

const ScenarioModal: FC<ScenarioModalProps> = ({ lang }) => {
  const [opened, setOpened] = useState(false);

  return (
    <>
      {/* eslint-disable-next-line */}
      <p
        className="cursor-pointer text-pink-500 underline"
        onClick={() => setOpened(true)}
      >
        Scénář
      </p>
      <Modal
        centered
        fullScreen
        opened={opened}
        padding="lg"
        size="xl"
        title={<b className="text-2xl">Scénář k videu</b>}
        onClose={() => setOpened(false)}
      >
        <div className="space-y-4 text-sm md:text-base">
          {scenarioContent[lang].map((paragraph, idx) => (
            <p key={idx}>
              {paragraph.split("\n").map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
          ))}
        </div>
      </Modal>
    </>
  );
};

export default ScenarioModal;
