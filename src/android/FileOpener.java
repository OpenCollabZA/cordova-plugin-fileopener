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
package coza.opencollab.cordova.plugins.fileopener;

import java.io.IOException;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.net.Uri;
import android.webkit.MimeTypeMap;

public class FileOpener extends CordovaPlugin {

	@Override
	public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {

		try {
			if (action.equals("openFile")) {
				openFile(args);
				callbackContext.success();
				return true;
			}
		} catch (IOException e) {
			callbackContext.error("FAIL_TO_OPEN");
		} catch (RuntimeException e) {
			if(e instanceof ActivityNotFoundException){
				callbackContext.error("NO_APP");
			}else{
				callbackContext.error("FAIL_TO_OPEN");
			}

		}
		return false;
	}

	private void openFile(JSONArray args) throws IOException,JSONException {
		
		// URL of what we want to open
		String url = args.getString(0);
		
		// Mimetype of the content we want to open
		String mimeType = null;

		// Create URI
		Uri uri = Uri.parse(url);
		
		// If there is a mimetype in the args, use that
		if(!"null".equals(args.getString(1))){
			mimeType = args.getString(1);
		}
		else if(url.lastIndexOf('.') >= 0){
			String extension = url.substring(url.lastIndexOf('.')+1);
			mimeType = MimeTypeMap.getSingleton().getMimeTypeFromExtension(extension);
		}
		// If we still don't have a mime type, try using all
		if(mimeType == null){
			mimeType = "*/*";
		}
		
		Intent intent = new Intent(Intent.ACTION_VIEW);
		intent.setDataAndType(uri, mimeType);
		this.cordova.getActivity().startActivity(intent);
	}

}
