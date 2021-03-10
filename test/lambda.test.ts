import { on_event } from '../src/lambda/index';
import { CloudFormationCustomResourceEvent } from 'aws-lambda';

test('on_create', () => {
    const resourceProperties: CloudFormationCustomResourceEvent["ResourceProperties"] = {
        ServiceToken: ''
    }
    const event: CloudFormationCustomResourceEvent = {
        RequestType: 'Create',
        StackId: 'test-stack',
        ServiceToken: '',
        LogicalResourceId: '',
        ResourceType: '',
        RequestId: '',
        ResponseURL: '',
        ResourceProperties: resourceProperties
    };
    expect(on_event).toBeCalledWith(event, {}, expect.anything());
})