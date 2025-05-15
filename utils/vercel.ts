import axios from "axios";
import { toast } from "react-toastify";

import { DomainConfig } from "@/interfaces/bot";

const VERCEL_PROJECT_ID = process.env.NEXT_PUBLIC_VERCEL_PROJECT_ID!;
const VERCEL_TOKEN = process.env.NEXT_PUBLIC_VERCEL_TOKEN!;
const VERCEL_TEAM_TOKEN = process.env.NEXT_PUBLIC_FULL_ACCESS_VERCEL_TOKEN!;

export const verifyAndSaveDomain = async (domain: string) => {
  try {
    await axios.post(
      `https://api.vercel.com/v9/projects/${VERCEL_PROJECT_ID}/domains`,
      { name: domain },
      { headers: { Authorization: `Bearer ${VERCEL_TOKEN}` } },
    );
  } catch (err) {
    console.error("Chyba při ověření domény", err);
    toast.error("Nepodařilo se ověřit doménu.");
  }
};

export const removeDomain = async (domain: string) => {
  try {
    await axios.delete(
      `https://api.vercel.com/v9/projects/${VERCEL_PROJECT_ID}/domains/${domain}`,
      { headers: { Authorization: `Bearer ${VERCEL_TOKEN}` } },
    );
    console.log(`✅ Doména ${domain} odebrána z Vercelu`);
  } catch (err) {
    console.warn(`⚠️ Nepodařilo se odebrat doménu (${domain}):`, err);
  }
};

export const handleDomainChange = async (
  oldDomain: string | null,
  newDomain: string | null,
) => {
  if (oldDomain && oldDomain !== newDomain) {
    await removeDomain(oldDomain);
  }

  if (newDomain) {
    newDomain !== "" && (await verifyAndSaveDomain(newDomain));
  }
};

export const getDNSInstructions = async (
  domain: string,
): Promise<string | null> => {
  try {
    const { data: config } = await axios.get<DomainConfig>(
      `https://api.vercel.com/v6/domains/${domain}/config`,
      {
        headers: { Authorization: `Bearer ${VERCEL_TEAM_TOKEN}` },
      },
    );

    if (!config.misconfigured) return "✅ Doména byla úspěšně ověřena.";

    let instructions = `⚠️ Doména je špatně nakonfigurována.\n\n`;

    if (config.recommendedIPv4?.length) {
      const ips = config.recommendedIPv4
        .map((ip) => ip.value.join(", "))
        .join(", ");

      instructions += `➡️ Přidej A záznam pro doménu: ${domain} → ${ips}\n`;
    }

    if (config.recommendedCNAME?.length) {
      const cnames = config.recommendedCNAME.map((c) => c.value).join(", ");

      instructions += `➡️ Nebo přidej CNAME záznam: ${domain} → ${cnames}\n`;
    }

    const vercelNameservers = ["ns1.vercel-dns.com", "ns2.vercel-dns.com"];

    if (config.nameservers?.length) {
      instructions += `\n🧭 Aktuální nameservery:\n`;
      instructions += config.nameservers.map((ns) => `• ${ns}`).join("\n");

      const lowerCurrent = config.nameservers.map((ns) => ns.toLowerCase());
      const missing = vercelNameservers.filter(
        (vercelNs) => !lowerCurrent.includes(vercelNs),
      );

      if (missing.length > 0) {
        instructions += `\n\n❌ Nameservery neodpovídají těm, které vyžaduje Vercel.\n`;
        instructions += `Změň nameservery na:\n`;
        instructions += vercelNameservers.map((ns) => `• ${ns}`).join("\n");
      } else {
        instructions += `\n✅ Nameservery odpovídají požadavkům Vercelu.`;
      }
    } else {
      instructions += `\n⚠️ Nameservery nebyly detekovány. Zkontroluj nastavení DNS.`;
    }

    return instructions;
  } catch (err) {
    console.warn("Nepodařilo se načíst ověření domény:", err);

    return "❌ Nepodařilo se získat informace o doméně.";
  }
};
