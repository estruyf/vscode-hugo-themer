import { CancellationToken, Hover, HoverProvider, MarkdownString, Position, ProviderResult, Range, TextDocument } from "vscode";
import { processLine } from "../utils/processLine";


export class HugoHoverProvider implements HoverProvider {

  public async provideHover(document: TextDocument, position: Position, token: CancellationToken): Promise<Hover | undefined> {
    const file = await processLine(document, position, token);

    if (file) {
      const lineText = document.lineAt(position.line).text;

      const startIdx = lineText.indexOf("{{");
      const endIdx = lineText.indexOf("}}");

      const rangeBegin = new Position(position.line, startIdx);
      const rangeEnd = new Position(position.line, endIdx + 2);
      const range = new Range(rangeBegin, rangeEnd);
      
      return new Hover(new MarkdownString().appendCodeblock(`file: "${file.fsPath}"`, "typescript"), range);
    }

    return undefined;
  }
}