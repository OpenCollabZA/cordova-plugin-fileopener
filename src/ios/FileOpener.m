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
