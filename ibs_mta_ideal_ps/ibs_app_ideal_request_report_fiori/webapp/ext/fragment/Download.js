sap.ui.define([
    "sap/m/MessageToast"
], function(MessageToast) {
    'use strict';

    return {
        onPress: function(oEvent) {
            debugger
            // MessageToast.show("Custom handler invoked.");
            
              // var down=oEvent.getSource().getBindingContext().getObject().FILE_CONTENT

              var pdfContentBase64 = oEvent.getSource().getBindingContext().getObject().FILE_NAME;
              var pdfContentUint8Array = new Uint8Array(atob(pdfContentBase64).split("").map(char => char.charCodeAt(0)));
                          
              var pdfBlob = new Blob([pdfContentUint8Array], { type: pdfContentBase64.MimeType });
              var pdfBlobURL = URL.createObjectURL(pdfBlob);
  
              var downloadLink = document.createElement('a');
              downloadLink.href = pdfBlobURL;
              downloadLink.download = pdfContentBase64.FileName;
                                  
              downloadLink.click();
                      
              // document.body.removeChild(downloadLink);
  
              URL.revokeObjectURL(pdfBlobURL);

        }
    };
});
