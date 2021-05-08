import * as vscode from 'vscode';

export type JumpDirection = "Up" | "Down"; 

export const getFirstNonEmptyLine = (editor: vscode.TextEditor, line: number, dir: JumpDirection): number => {
    const isOnTheEdge = () => {
        switch (dir) {
            case "Up": return line <= 0;
            case "Down": return line + 1 >= editor.document.lineCount;
        }
    };

    if (isOnTheEdge()) {
        switch (dir) {
            case "Up": return 0;
            case "Down": return editor.document.lineCount -1;
        }
    }

    const currentLine = editor.document.lineAt(line);

    if (!currentLine.isEmptyOrWhitespace) {
        return line;
    } else {
        switch (dir) {
            case "Up": return getFirstNonEmptyLine(editor, line - 1, dir);
            case "Down": return getFirstNonEmptyLine(editor, line + 1, dir);
        }
    }
};

export const getCharPosition = (editor: vscode.TextEditor, line: number, lastCharPosition: number, currentCharPosition: number) => {
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