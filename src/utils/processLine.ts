import { join } from "path";
import { CancellationToken, Position, TextDocument, Uri, workspace } from "vscode";

export const processLine = async (document: TextDocument, position: Position, token: CancellationToken) => {
  let lineText = document.lineAt(position.line).text;

  if (lineText && lineText.includes("partial")) {
    const partialType = lineText.includes(`partialCached`) ? `partialCached` : `partial`;

    lineText = lineText.trim();
    const splitText = lineText.split(' ');
    const partialPathQuoted = splitText[splitText.indexOf(partialType) + 1];

    if (partialPathQuoted) {
      const partialPath = join("/partials/", partialPathQuoted.replace(/['"]+/g, ''));
      const files = await workspace.findFiles(`**${partialPath}`, '/node_modules/**', 1);

      if (files && files.length > 0) {
        const file = files[0];
        const definitionResource = Uri.file(file.fsPath);
        return definitionResource;
      }
    }
  }

  return undefined;
}