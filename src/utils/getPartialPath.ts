export const getPartialPath = (lineText: string) => {
  const partialType = lineText.includes(`partialCached`) ? `partialCached` : `partial`;

  lineText = lineText.trim();
  const splitText = lineText.split(' ');
  const partialPathQuoted = splitText[splitText.indexOf(partialType) + 1];

  return partialPathQuoted || undefined;
}