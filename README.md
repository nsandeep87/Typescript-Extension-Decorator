# Typescript-Extension-Decorator
* This is a method decorator used to provide base method extensibility. The exitensibility (User Exits) are generic, reusable and avoid repeated modificatioof base code whenever a new UE requested.
* The idea is based on typecript decorators
* Using tyepscript decorators we are able to store the references of function descriptor, replace with that of extenion method. Once the extension method is done with execution,we can invoke the base method again. Please refer ExeuteExtensionCode and ExecuteBaseMethod
*  In the example I use the method exeuteExtensionCode to mock an async Extension code.
* This sample method is a promise wrapped over a setTimeout of 5 seconds
* ExecuteBaseMethod is a method that delegates the control back to base application. For that this has to invoke the orginal method. 
