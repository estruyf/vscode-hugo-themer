import * as vscode from 'vscode';
import { HugoDefinitionProvider } from './providers/HugoDefinitionProvider';

const HTML_MODE: vscode.DocumentFilter = { language: 'html', scheme: 'file' };

const EXTENSION_NAME = `eliostruyf.hugo-themer`;
export function activate(context: vscode.ExtensionContext) {
	
	context.subscriptions.push(vscode.languages.registerDefinitionProvider(HTML_MODE, new HugoDefinitionProvider()));

	console.log(`${EXTENSION_NAME}: activated`);
}

// this method is called when your extension is deactivated
export function deactivate() {}


