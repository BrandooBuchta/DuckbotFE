export const replaceAcademyLinks = (input: string): string => {
  const academyLinkRegex =
    /https:\/\/betfin\.network\/academy\/new\/\?code=[a-zA-Z0-9]+&type=[a-zA-Z]+/g;

  return input ? input.replaceAll(academyLinkRegex, "{academyLink}") : input;
};
