import { expect, haveResource, countResources } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { SesUser } from '../src';

describe('User', () => {
  it('creates the user', () => {
    const stack = new cdk.Stack();
    new SesUser(stack, 'User');
    expect(stack).to(haveResource('AWS::IAM::User'));
    expect(stack).to(countResources('AWS::IAM::User', 1));
  });
  it('creates the access_key', () => {
    const stack = new cdk.Stack();
    new SesUser(stack, 'User');
    expect(stack).to(haveResource('AWS::IAM::AccessKey'));
    expect(stack).to(countResources('AWS::IAM::AccessKey', 1));
  });
});
