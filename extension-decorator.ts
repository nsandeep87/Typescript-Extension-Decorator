
/**
* This is a method decorator used to provide base method extensibility
* so that the user exits(UE) are generic, reusable and avoid repeated modification
* of base code whenever a new UE requested.

* @param extensionId Inline extension Id
* @param fnName Inline function name
* @param returnType Return type of the method on which this decorator is added.
*/
export function AddExtension(extensionId, fnName, returnType):MethodDecorator{

return function (target: Function, key: string, descriptor: any) {

  const originalMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {

    return (async () => {
      let result;
      let extensionResult;
      let extensionObject = null;
      try {
        if ( fnName) {

            extensionResult = await executeExtensionCode(args, extensionId, fnName);
            if (extensionResult && (extensionResult.skipBaseFlow || extensionResult.error)) {
              if (originalMethod instanceof Promise) {
                return Promise.resolve(extensionResult.outputParams || args)
              }
              else {
                return extensionResult.outputParams || args
              }
            }
            else {
              let outputParams;
              if (extensionResult && extensionResult.outputParams) {
                outputParams = extensionResult.outputParams
              } else {
                outputParams = args
              }
              return executeBaseMethod(originalMethod, outputParams, this);
            }
          }
      }
      catch (e) {
        console.log("Extension Decorator -> MethodExit -> Error:" + e)
        return executeBaseMethod(originalMethod, args, this)
      }
    })();
  }
  return descriptor;
}
}

/* In the example I use the method exeuteExtensionCode to mock an async Extension code.
* This sample method is a promise wrapped over a setTimeout of 5 seconds*/
async function  executeExtensionCode(args,extensionId,fnName){
  return new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve({
          "baseArguments":args,
          "extensionId":extensionId
        })
    },5000)
  });
}

/*ExecuteBaseMethod is a method that delegates the control back to base application. For that this has to invoke the orginal method. */
function executeBaseMethod(originalMethod,args,_this){
console.log("Extension Decorator -> executeBaseMethod")
let result = originalMethod.apply(_this, args);
if(result && typeof result.then == 'function'){
    return result.then((response)=>{
        return Promise.resolve(response);
    }).catch((response)=>{
      return Promise.reject(response)
    })
}
else{
    return result;
}
}
