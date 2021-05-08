import * as vscode from 'vscode';
import * as Utils from './utilities';

let lastCharPosition = -1;
let currentCharPosition = -1;

const checkIfCharPositionChanged = (editor: vscode.TextEditor) => {
	const position = editor.selection.active;
	if (currentCharPosition !== -1 && position.character !== currentCharPosition) {
		lastCharPosition = position.character;
	}
};

const moveUp = (editor: vscode.TextEditor, size: number, highlight: boolean) => {
	const position = editor.selection.active;
	const line = Utils.getFirstNonEmptyLine(editor, position.line - size, "Up");

	let char = Utils.getCharPosition(editor, line, currentCharPosition, lastCharPosition);

	const endSelection = editor.selection.anchor;

	var newPosition = position.with(line, char);
	var newSelection = new vscode.Selection(highlight ? endSelection : newPosition, newPosition);
	editor.selection = newSelection;
};
const moveDown = (editor: vscode.TextEditor, size: number, highlight: boolean) => {
	const position = editor.selection.active;
	const line = Utils.getFirstNonEmptyLine(editor, position.line + size, "Down");

	let char = Utils.getCharPosition(editor, line, currentCharPosition, lastCharPosition);

	const startSelection = editor.selection.anchor;

	var newPosition = position.with(line, char);
	var newSelection = new vscode.Selection(highlight ? startSelection : newPosition, newPosition);
	editor.selection = newSelection;
};
const scrollTo = (editor: vscode.TextEditor) => {
	editor.revealRange(
		editor.selection,
		vscode.TextEditorRevealType.Default
	);
};

const getJumpSize = (): number => vscode.workspace.getConfiguration("rabit-move").get("jump-size") as number;

export function activate(context: vscode.ExtensionContext) {
	let rabitDown = vscode.commands.registerCommand('rabit-move.rabit-down', () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}

		checkIfCharPositionChanged(editor);
		moveDown(editor, getJumpSize(), false);
		scrollTo(editor);
	});
	let rabitUp = vscode.commands.registerCommand('rabit-move.rabit-up', () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}

		checkIfCharPositionChanged(editor);
		moveUp(editor, getJumpSize(), false);
		scrollTo(editor);
	});
	let rabitSelectDown = vscode.commands.registerCommand('rabit-move.rabit-select-down', () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}

		checkIfCharPositionChanged(editor);
		moveDown(editor, getJumpSize(), true);
		scrollTo(editor);
	});
	let rabitSelectUp = vscode.commands.registerCommand('rabit-move.rabit-select-up', () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}

		checkIfCharPositionChanged(editor);
		moveUp(editor, getJumpSize(), true);
		scrollTo(editor);
	});
	let tortoiseSelectDown = vscode.commands.registerCommand('rabit-move.tortoise-select-down', () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}

		checkIfCharPositionChanged(editor);
		moveDown(editor, 1, true);
		scrollTo(editor);
	});
	let tortoiseSelectUp = vscode.commands.registerCommand('rabit-move.tortoise-select-up', () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}

		checkIfCharPositionChanged(editor);
		moveUp(editor, 1, true);
		scrollTo(editor);
	});

	context.subscriptions.push(rabitDown);
	context.subscriptions.push(rabitUp);
	context.subscriptions.push(rabitSelectDown);
	context.subscriptions.push(rabitSelectUp);
	context.subscriptions.push(tortoiseSelectDown);
	context.subscriptions.push(tortoiseSelectUp);
}

export function deactivate() { }
