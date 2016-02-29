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

#import "FileOpener.h"
#import <MobileCoreServices/MobileCoreServices.h>

@implementation FileOpener

@synthesize controller = documentInteractionController;

- (void) openFile: (CDVInvokedUrlCommand*)command
{

    CDVPluginResult* pluginResult;
    NSString *path = [command.arguments objectAtIndex:0];

    NSArray *parts = [path componentsSeparatedByString:@"/"];
    NSString *previewDocumentFileName = [parts lastObject];
    NSLog(@"The file name is %@", previewDocumentFileName);

    NSURL *fileURL = [NSURL fileURLWithPath:path];

    // Initialize Document Interaction Controller
    // http://code.tutsplus.com/tutorials/ios-sdk-previewing-and-opening-documents--mobile-15130
    documentInteractionController = [UIDocumentInteractionController interactionControllerWithURL:fileURL];

    // Configure Document Interaction Controller
    [documentInteractionController setDelegate:self];

    CDVViewController* cont = (CDVViewController*)[ super viewController ];
//    CGSize viewSize = cont.view.bounds.size;
//    CGRect rect = CGRectMake(0, 0, viewSize.width, viewSize.height);
    CGRect rect = CGRectMake(0, 0, 1500.0f, 50.0f);
    BOOL wasOpened = [documentInteractionController presentOpenInMenuFromRect:rect inView:cont.view animated:YES];

    if(wasOpened) {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString: @""];
        NSLog(@"Success");
    }
    else {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"NO_APP"];
        NSLog(@"Could not handle UTI");
    }
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void) documentInteractionControllerDidDismissOptionsMenu:(UIDocumentInteractionController *)controller {
}

- (void) documentInteractionController: (UIDocumentInteractionController *) controller didEndSendingToApplication: (NSString *) application {
    // Nothing here
}

@end
