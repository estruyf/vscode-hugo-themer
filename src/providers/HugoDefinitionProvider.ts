import * as vscode from 'vscode';
import * as path from 'path';

export class HugoDefinitionProvider implements vscode.DefinitionProvider {

  /**
   * Provide the definition of the symbol at the given position and document.
   * @param document 
   * @param position 
   * @param token 
   */
	public async provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Promise<vscode.Location | null> {
		let lineText = document.lineAt(position.line).text;
		if (lineText && lineText.includes("partial")) {
			lineText = lineText.trim();
			const splitText = lineText.split(' ');
			const partialPathQuoted = splitText[splitText.indexOf("partial") + 1];
			if (partialPathQuoted) {
				const partialPath = path.join("/partials/", partialPathQuoted.replace(/['"]+/g, ''));
				const files = await vscode.workspace.findFiles(`**${partialPath}`, '/node_modules/**', 1);
				if (files && files.length > 0) {
					const file = files[0];
					const definitionResource = vscode.Uri.file(file.fsPath);
					const pos = new vscode.Position(0, 0);
					return new vscode.Location(definitionResource, pos);
				}
			}
		}
		return null;
	}
}