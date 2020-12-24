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

const moveUp = (editor: vscode.TextEditor, size: number, highlight: boolean) => {
	const position = editor.selection.active;

	let line = position.line - size;;
	if (line < 0) {
		line = 0;;
	}

	let char = getCharPosition(editor, line);

	const endSelection = editor.selection.end;

	var newPosition = position.with(line, char);
	var newSelection = new vscode.Selection(highlight ? endSelection : newPosition, newPosition);
	editor.selection = newSelection;
};
const moveDown = (editor: vscode.TextEditor, size: number, highlight: boolean) => {
	const position = editor.selection.active;

	let line = position.line + size;

	if (line >= editor.document.lineCount) {
		line = editor.document.lineCount - 1;
	}

	let char = getCharPosition(editor, line);

	const startSelection = editor.selection.start;

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

	context.subscriptions.push(rabitDown);
	context.subscriptions.push(rabitUp);
	context.subscriptions.push(rabitSelectDown);
	context.subscriptions.push(rabitSelectUp);
}

export function deactivate() { }
