import { join, parse } from "path";
import { CancellationToken, CompletionContext, CompletionItem, CompletionItemKind, CompletionItemProvider, CompletionList, Position, ProviderResult, TextDocument, workspace } from "vscode";
import { getPartialPath } from "../utils/getPartialPath";
import { parseWinPath } from "../utils/parseWinPath";


export class HugoCompletionProvider implements CompletionItemProvider {

  public async provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken, context: CompletionContext): Promise<CompletionItem[] | CompletionList<CompletionItem> | undefined> {
    const lineText = document.lineAt(position.line).text;
    
    if (lineText && lineText.includes("partial")) {
      let partialPathQuoted = getPartialPath(lineText);
      if (partialPathQuoted) {
        partialPathQuoted = partialPathQuoted.replace(/['"]+/g, '');
        partialPathQuoted = parseWinPath(partialPathQuoted);
      }

      // Retrieve all the partials from the project
      const searchPath = join(`**/partials/`, partialPathQuoted || "", `**/*.html`);
      const files = await workspace.findFiles(searchPath, '/node_modules/**');

      if (files && files.length > 0) {
        const partialFiles = files.map(file => {
          const parsedPath = parseWinPath(file.fsPath);
          const splitPath = parsedPath.split('/partials/');
          const lastPath = splitPath.pop();

          if (!lastPath) {
            return;
          }

          return {
            label: parse(lastPath).base,
            kind: CompletionItemKind.File,
            detail: lastPath,
            insertText: lastPath.replace(partialPathQuoted || "", "")
          } as CompletionItem;
        });

        return partialFiles.filter(item => item) as CompletionItem[];
      }
    }

    return undefined;
  }
}