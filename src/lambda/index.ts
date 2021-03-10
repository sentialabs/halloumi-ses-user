import {} from "@aws-cdk/aws-lambda";
import { CloudFormationCustomResourceEvent, Context } from "aws-lambda";

function on_create(event: CloudFormationCustomResourceEvent) {
    if (event['RequestType'] == 'Update') {
        console.log('hello')
    }

}
function on_update(event: CloudFormationCustomResourceEvent) {
    console.log(event);

}
function on_delete(event: CloudFormationCustomResourceEvent) {
    console.log(event);
    
}

export const on_event = (event: CloudFormationCustomResourceEvent, context?: Context) => {
    // console.log(event);
    if (context)
        console.log(context);
    const request_type = event['RequestType'];
    if (request_type == 'Create'){ return on_create(event)}
    if (request_type == 'Update'){ return on_update(event)}
    if (request_type == 'Delete'){ return on_delete(event)}
    return true;
}
