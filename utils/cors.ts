import { Octokit } from "@octokit/rest";

const auth = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
const octokit = new Octokit({ auth });

const owner = "BrandooBuchta";
const repo = "bot-configurator-api";
const branch = "main";
const originsPath = "data/origins.json";

export async function updateCORSPolicy(
  oldDomain: string | null,
  newDomain?: string | null,
): Promise<void> {
  const { data } = await octokit.repos.getContent({
    owner,
    repo,
    path: originsPath,
    ref: branch,
  });

  if (!("content" in data)) {
    throw new Error("Origins file has no content");
  }

  const content = Buffer.from(data.content, "base64").toString("utf-8");
  const parsed = JSON.parse(content);

  if (!Array.isArray(parsed.origins)) {
    throw new Error("Invalid origins format");
  }

  let updatedOrigins = [...parsed.origins];

  if (oldDomain && oldDomain.trim() !== "") {
    updatedOrigins = updatedOrigins.filter(
      (origin) => !origin.includes(oldDomain.trim()),
    );
  }

  // Přidání nového s prefixem https://
  if (newDomain && newDomain.trim() !== "") {
    const fullNewDomain = `https://${newDomain.trim()}`;

    if (!updatedOrigins.some((origin) => origin.includes(newDomain.trim()))) {
      updatedOrigins.push(fullNewDomain);
    }
  }

  // Kontrola, zda došlo ke změně
  if (JSON.stringify(updatedOrigins) === JSON.stringify(parsed.origins)) {
    return;
  }

  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: originsPath,
    message: `Update CORS policy: ${oldDomain ? `remove ${oldDomain}` : ""}${oldDomain && newDomain ? " + " : ""}${newDomain ? `add ${newDomain}` : ""}`,
    content: Buffer.from(
      JSON.stringify({ origins: updatedOrigins }, null, 2),
    ).toString("base64"),
    sha: data.sha,
    branch,
  });
}
