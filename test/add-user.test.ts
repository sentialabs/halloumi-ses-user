
import { expect, haveResource } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { SesUser } from '../src';

test('addUser', () => {
  const stack = new cdk.Stack();
  new SesUser(stack, 'User');
  expect(stack).to(haveResource('AWS::IAM::User'));
});