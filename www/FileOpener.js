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
module.exports = {
	/**
	 * arguments should be in the following format
	 *
	 * 1) A string path to a file/link to open
	 *
	 * 2) An object with the following fields:
	 *   {
	 *   	'path' : 'path to your content',
	 *   	'mimeType' : 'mimetype for your content'
	 *
	 *   }
	 */
	open : function (params, success, failure) {

		// Check the success and fail methods
		success = success || function(){};
		failure = failure || function(){};

		// URL we are trying to open
		var url = params;

		var mimeType = null;

		// Check the arguments
		if(typeof(params) == 'object'){
			url = params.path;
			mimeType = params.mimeType;
		}

		// Call the native code
		function openFile(){
			cordova.exec(success, failure, 'FileOpener', 'openFile', [url, mimeType]);
		}

		// If the url is a file or web link, we can pass it on
		if( url.indexOf('http://') === 0 ||
			url.indexOf('https://') === 0){
			mimeType = null; // ignore mimetype for urls
			openFile();
		}
		else if(url.indexOf('file://') === 0){
			openFile();
		}
		// Else we need to convert the path to a local path
		else{
			// First convert the the path to the device path
			resolveLocalFileSystemURL(url,
				function (fileEntry) {
					url = fileEntry.toURL();
					openFile();
				}, function(){
					failure('Failed to get file');
				});
		}
	},
	FAIL_TO_OPEN : 'FAIL_TO_OPEN',
	NO_APP : 'NO_APP'
};
