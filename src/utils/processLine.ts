import { join } from "path";
import { CancellationToken, Position, TextDocument, Uri, workspace } from "vscode";
import { getPartialPath } from "./getPartialPath";

export const processLine = async (document: TextDocument, position: Position, token: CancellationToken) => {
  let lineText = document.lineAt(position.line).text;

  if (lineText && lineText.includes("partial")) {
    const partialPathQuoted = getPartialPath(lineText);

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