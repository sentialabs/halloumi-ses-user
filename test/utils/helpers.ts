import { CloudFormationCustomResourceEvent, Context } from 'aws-lambda'; // eslint-disable-line import/no-unresolved

const DEFAULT_OPTIONS = {
  RequestType: 'Create',
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

export function constructCFNCRREvent (options: any = DEFAULT_OPTIONS): CloudFormationCustomResourceEvent {
  const opts = Object.assign({}, DEFAULT_OPTIONS, options);
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