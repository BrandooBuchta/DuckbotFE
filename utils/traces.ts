import { Octokit } from "@octokit/rest";

const auth = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

const octokit = new Octokit({ auth });

const owner = "BrandooBuchta";
const repo = "bot-configurator-api";
const branch = "main";

const basePath = "data";

export async function checkOrCreateLevelJson(
  botId: string,
  lang: "cs" | "en" | "esp" | "sk",
  isEvent: boolean,
  level: number,
): Promise<{ redirectUrl: string }> {
  const customPath = `${basePath}/customs/${botId}/level-${level}.json`;

  try {
    await octokit.repos.getContent({
      owner,
      repo,
      path: customPath,
      ref: branch,
    });

    return {
      redirectUrl: `/customs?level=${level}`,
    };
  } catch (err: any) {
    if (err.status !== 404) throw err;
  }

  const type = isEvent ? "event" : "online";
  const fallbackPath = `${basePath}/traces/${lang}/${type}/level-${level}.json`;

  const { data: fallbackFile } = await octokit.repos.getContent({
    owner,
    repo,
    path: fallbackPath,
    ref: branch,
  });

  if (!("content" in fallbackFile)) {
    throw new Error("Fallback file has no content");
  }

  const content = fallbackFile.content;
  const decoded = Buffer.from(content, "base64").toString("utf-8");

  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: customPath,
    message: `create level-${level}.json for bot ${botId}`,
    content: Buffer.from(decoded).toString("base64"),
    branch,
  });

  return {
    redirectUrl: `/customs?level=${level}`,
  };
}
