#import <Cordova/CDV.h>

@interface FileOpener : CDVPlugin <UIDocumentInteractionControllerDelegate> {

}

@property(nonatomic, strong) UIDocumentInteractionController *controller;

- (void) openFile: (CDVInvokedUrlCommand*)command;

@end
