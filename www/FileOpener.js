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
