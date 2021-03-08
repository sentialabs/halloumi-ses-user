
import { expect, haveResource, countResources } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { SesUser } from '../src';

test('creates the user', () => {
  const stack = new cdk.Stack();
  new SesUser(stack, 'User');
  expect(stack).to(haveResource('AWS::IAM::User'));
  expect(stack).to(countResources('AWS::IAM::User', 1));
});