import * as vscode from 'vscode';

let lastCharPosition = -1;
let currentCharPosition = -1;

const checkIfCharPositionChanged = (editor: vscode.TextEditor) => {
	const position = editor.selection.active;
	if (currentCharPosition !== -1 && position.character !== currentCharPosition) {
		lastCharPosition = position.character;
	}
};

const getCharPosition = (editor: vscode.TextEditor, line: number) => {
	const position = editor.selection.active;
	const lineSize = editor.document.lineAt(line).text.length;

	if (lastCharPosition > -1) {
		if (lineSize > lastCharPosition) {
			currentCharPosition = lastCharPosition;
			return lastCharPosition;
		} else {
			currentCharPosition = lineSize;
			return lineSize;
		}
	} else {
		lastCharPosition = position.character;
		currentCharPosition = lastCharPosition;
		return lastCharPosition;
	}
};

const moveUp = (editor: vscode.TextEditor, size: number) => {
	const position = editor.selection.active;

	let line = position.line - size;;
	if (line < 0) {
		line = 0;;
	}

	let char = getCharPosition(editor, line);

	var newPosition = position.with(line, char);
	var newSelection = new vscode.Selection(newPosition, newPosition);
	editor.selection = newSelection;
};
const moveDown = (editor: vscode.TextEditor, size: number) => {
	const position = editor.selection.active;

	let line = position.line + size;

	if (line >= editor.document.lineCount) {
		line = editor.document.lineCount - 1;
	}

	let char = getCharPosition(editor, line);

	var newPosition = position.with(line, char);
	var newSelection = new vscode.Selection(newPosition, newPosition);
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
		moveDown(editor, getJumpSize());
		scrollTo(editor);
	});
	let rabitUp = vscode.commands.registerCommand('rabit-move.rabit-up', () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}

		checkIfCharPositionChanged(editor);
		moveUp(editor, getJumpSize());
		scrollTo(editor);
	});

	context.subscriptions.push(rabitDown);
	context.subscriptions.push(rabitUp);
}

export function deactivate() { }
