import { expect, haveResource, countResources } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { SesUser } from '../src';

describe('User', () => {
  it('creates the user', () => {
    const stack = new cdk.Stack();
    new SesUser(stack, 'User');
    let secret = {
      'Fn::Join': [
        '',
        [
          '{"access_keys":"',
          {
            Ref: 'UserAccessKeys',
          },
          '","secret_key":"',
          {
            'Fn::GetAtt': [
              'UserAccessKeys',
              'SecretAccessKey',
            ],
          },
          '"}',
        ],
      ],
    };
    expect(stack).to(haveResource('AWS::IAM::User'));
    expect(stack).to(countResources('AWS::IAM::User', 1));
    expect(stack).to(haveResource('AWS::IAM::AccessKey'));
    expect(stack).to(countResources('AWS::IAM::AccessKey', 1));
    expect(stack).to(haveResource('AWS::SecretsManager::Secret', {
      SecretString: secret,
    }));
    expect(stack).to(haveResource('AWS::IAM::Role'));
    expect(stack).to(countResources('AWS::IAM::Role', 1));
  });
});
