# cordova-plugin-fileopener
A cordova plugin that prompts the user for a application to open files with.
If the file type is a url, the plugin will open the link in a external browser

Adding the Plugin to your project
-----------
    $ cordova plugin add https://github.com/OpenCollabZA/cordova-plugin-fileopener.git
    
Usage
-----------
```javascript
var FileOpener = window.plugins.FileOpener;
var option = {
    'path' : "cdvfile://path/to/file",
    'mimeType' : "text/html"
};
function successHandler(){
   // Handle file being opened
}
function errorHandler(error){
  // Handle error opening the file
}

// Call the plugin
FileOpener.open(option,successHandler, errorHandler);
```
Errors
-----------
```javascript
FileOpener.FAIL_TO_OPEN

FileOpener.NO_APP
```
