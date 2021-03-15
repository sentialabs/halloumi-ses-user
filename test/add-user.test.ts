import { expect, haveResource, countResources } from '@aws-cdk/assert';
import { Stack } from '@aws-cdk/core';
import { SesUser } from '../src';

describe('User', () => {
  it('creates the user', () => {
    const stack = new Stack();
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
    expect(stack).to(countResources('AWS::IAM::Role', 1));
    expect(stack).to(haveResource('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [{
          Effect: 'Allow',
          Principal: { Service: 'lambda.amazonaws.com' },
          Action: 'sts:AssumeRole',
        }],
        Version: '2012-10-17',
      }
    }));
    expect(stack).to(countResources('AWS::IAM::Policy', 1));
    expect(stack).to(haveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: "Allow",
            Action: [
              "secretsmanager:GetResourcePolicy",
              "secretsmanager:GetSecretValue",
              "secretsmanager:DescribeSecret",
              "secretsmanager:ListSecretVersionIds"
            ],
            Resource: {
              "Ref": "UserSecret"
            }
          }
        ]
      }
    }));
  });
});
