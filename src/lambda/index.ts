import { CloudFormationCustomResourceEvent, Context } from 'aws-lambda'; // eslint-disable-line import/no-unresolved
import * as cfnResp from 'cfn-response';

function response(event: CloudFormationCustomResourceEvent, context: Context, message: string, err?: any): Promise<string> {
  return new Promise(() => {
    let status: cfnResp.ResponseStatus = 'SUCCESS';
    if (err) { console.log(event, context, err); status = 'FAILED'; } else {console.log(message);}
    if (Object.prototype.hasOwnProperty.call(event, 'RequestType')) return cfnResp.send(event, context, status, err ? { error: err } : { message }, event.LogicalResourceId);
    return status;
  });
}

function on_create(event: CloudFormationCustomResourceEvent, context: Context) {
  response(event, context, 'Success').then(data => {
    console.log(data);
  }).catch(err => {
    console.log(err);
  });
}
function on_update(event: CloudFormationCustomResourceEvent) {
  console.log(event);

}
function on_delete(event: CloudFormationCustomResourceEvent) {
  console.log(event);

}

export function on_event(event: CloudFormationCustomResourceEvent, context: Context) {
  console.log(event);
  console.log(context);
  const request_type = event.RequestType;
  if (request_type == 'Create') { return on_create(event, context);}
  if (request_type == 'Update') { return on_update(event);}
  if (request_type == 'Delete') { return on_delete(event);}
};
