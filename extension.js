const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	function showPanel() {
		const panel = vscode.window.createWebviewPanel(
			'Daily AI Detection', 
			'Daily AI Detection', 
			vscode.ViewColumn.One, 
			{enableScripts:true} 
		);
		panel.webview.html = getWebviewContent(panel);
		return panel;
	}

	let hasShownToday = false;
	const today = new Date().toISOString().split('T')[0];
	const lastOpenDate = context.globalState.get('lastOpenDate');
		if (lastOpenDate !== today) {
			context.globalState.update('lastOpenDate', today);
				showPanel();
				hasShownToday = true;
	}

	const disposable = vscode.commands.registerCommand('daily-ai-detection.daily-test', function () {
		if (!hasShownToday) {
			showPanel();
		}
	});
		
	context.subscriptions.push(disposable);
}

function getWebviewContent(panel) {
	const htmlpath = path.join(__dirname, 'src', 'index.html');
	const jsUri = panel.webview.asWebviewUri(vscode.Uri.file(path.join(__dirname, 'src', 'index.js')));
	console.log('HTML file path:', htmlpath);
	console.log('JS file URI:', jsUri.toString());
	try {
		let htmlContent = fs.readFileSync(htmlpath, 'utf8');
		htmlContent = htmlContent.replace('<script src="index.js" defer></script>', `<script src="${jsUri}" defer></script>`);
		return htmlContent;
	}
	catch (err) {
		console.error('Error reading HTML file:', err);
		return '';
	}
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
