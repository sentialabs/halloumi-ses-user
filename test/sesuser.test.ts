import { expect, haveResource, countResources, haveResourceLike } from '@aws-cdk/assert';
import { Stack } from '@aws-cdk/core';
import { SesUser } from '../src';

describe('User', () => {
  it('creates the user', () => {
    const stack = new Stack();
    new SesUser(stack, 'User');
    expect(stack).to(haveResource('AWS::IAM::User'));
    expect(stack).to(countResources('AWS::IAM::User', 1));
    expect(stack).to(haveResource('AWS::IAM::AccessKey'));
    expect(stack).to(countResources('AWS::IAM::AccessKey', 1));
    expect(stack).to(countResources('AWS::IAM::Role', 1));
    expect(stack).to(haveResource('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [{
          Effect: 'Allow',
          Principal: { Service: 'lambda.amazonaws.com' },
          Action: 'sts:AssumeRole',
        }],
        Version: '2012-10-17',
      },
    }));
    expect(stack).to(countResources('AWS::Lambda::Function', 1));
    expect(stack).to(haveResourceLike('AWS::Lambda::Function', {
      Role: {
        'Fn::GetAtt': [
          'UserRoleB7C3739B',
          'Arn',
        ],
      },
      Handler: 'index.on_event',
      Runtime: 'nodejs12.x',
    }));
    expect(stack).to(countResources('Custom::HalloumiSesUserPassword', 1));
    expect(stack).to(haveResource('Custom::HalloumiSesUserPassword', {
      ServiceToken: {
        'Fn::GetAtt': [
          'UserFunction89BB1343',
          'Arn',
        ],
      },
      SecretKey: {
        'Fn::GetAtt': [
          'UserAccessKeys',
          'SecretAccessKey',
        ],
      },
    }));
  });
});
