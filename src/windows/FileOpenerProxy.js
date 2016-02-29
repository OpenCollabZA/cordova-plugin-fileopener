/*
	The MIT License (MIT)
	
	Copyright (c) 2016 OPENCOLLAB
	
	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
*/
var cordova = require('cordova'),
	fileOpener = require('./FileOpener');

var schemes = [
	{ protocol : 'ms-app', getFile : getFileFromApplicationUri },
	{ protocol : 'file:///', getFile : getFileFromFileUri }
];

function getFileFromApplicationUri(uri) {
	var applicationUri = new Windows.Foundation.Uri(uri);
	return Windows.Storage.StorageFile.getFileFromApplicationUriAsync(applicationUri);
}

function getFileFromFileUri(uri) {
	var path = Windows.Storage.ApplicationData.current.localFolder.path + uri.substr(8);
	return getFileFromNativePath(path);
}

function getFileFromNativePath(path) {
	var nativePath = path.split('/').join('\\');
	return Windows.Storage.StorageFile.getFileFromPathAsync(nativePath);
}

function getFileLoaderForScheme(path) {
	var fileLoader = getFileFromNativePath;
	schemes.some(function (scheme) {
		return path.indexOf(scheme.protocol) === 0 ? ((fileLoader = scheme.getFile), true) : false;
	});
	return fileLoader;
}

module.exports = {
	openFile : function (successCallback, errorCallback, args) {
		var path = args[0].replace('ms-appdata:///local//', 'ms-appdata:///local/');
		var getFile = getFileLoaderForScheme(path);

		getFile(path).then(function (file) {
			var options = new Windows.System.LauncherOptions();
			options.displayApplicationPicker = true;
			Windows.System.Launcher.launchFileAsync(file, options).then(function (success) {
				if (success) {
					successCallback();
				}
				else {
					errorCallback();
				}
			});
		}, function() {
			console.log('Error abriendo el archivo');
		});
	}
};

require('cordova/exec/proxy').add('FileOpener', module.exports);
