import { CloudFormationCustomResourceEvent, Context } from 'aws-lambda'; // eslint-disable-line import/no-unresolved

const DEFAULT_EVENT = {
  RequestType: 'Create',
  ResourceProperties: {
    SecretKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
  },
};

const DEFAULT_CONTEXT = {
  awsRequestId: '',
  callbackWaitsForEmptyEventLoop: true,
  functionName: '',
  functionVersion: '',
  invokedFunctionArn: '',
  memoryLimitInMB: '',
  logGroupName: '',
  logStreamName: '',
};

export function constructCFNCRREvent (options: any = DEFAULT_EVENT): CloudFormationCustomResourceEvent {
  const opts = Object.assign({}, DEFAULT_EVENT, options);
  return {
    ServiceToken: '',
    ResponseURL: '',
    LogicalResourceId: '',
    PhysicalResourceId: '',
    RequestId: '',
    RequestType: opts.RequestType,
    ResourceType: '',
    StackId: '',
    ResourceProperties: {
      ServiceToken: '',
      SecretKey: opts.ResourceProperties.SecretKey,
    },
  };
}


export function constructCFNCRRContext (options: any = DEFAULT_CONTEXT): Context {
  const opts = Object.assign({}, DEFAULT_CONTEXT, options);
  return {
    awsRequestId: opts.awsRequestId,
    callbackWaitsForEmptyEventLoop: opts.callbackWaitsForEmptyEventLoop,
    functionName: opts.functionName,
    functionVersion: opts.functionVersion,
    invokedFunctionArn: opts.invokedFunctionArn,
    memoryLimitInMB: opts.memoryLimitInMB,
    logGroupName: opts.logGroupName,
    logStreamName: opts.logStreamName,
    getRemainingTimeInMillis: ():number => { return 10; },
    done: ( _error?: Error, _result?: any) => {return false;},
    fail: ( _error?: string | Error ) => {},
    succeed: ( _message?: string, _object?: any) => {return false;},
  };
}