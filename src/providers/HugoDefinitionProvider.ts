import { CancellationToken, DefinitionProvider, Location, Position, Range, TextDocument, workspace } from 'vscode';
import { processLine } from './../utils/processLine';

export class HugoDefinitionProvider implements DefinitionProvider {

  /**
   * Provide the definition of the symbol at the given position and document.
   * @param document 
   * @param position 
   * @param token 
   */
	public async provideDefinition(document: TextDocument, position: Position, token: CancellationToken): Promise<Location | undefined> {
		const file = await processLine(document, position, token);

		if (file) {
			let positionRange: Position | Range = new Position(0, 0);

			try {
				const fileContents = await workspace.openTextDocument(file);
				const totalLines = fileContents.lineCount;
				const lastLine = fileContents.lineAt(totalLines - 1);

				const rangeBegin = new Position(0, 0);
				const rangeEnd = new Position(totalLines, lastLine.text.length);
				positionRange = new Range(rangeBegin, rangeEnd);
			} catch (e) {
				// Something went wrong with opening the file
			}

			return new Location(file, positionRange);
		}
	}
}