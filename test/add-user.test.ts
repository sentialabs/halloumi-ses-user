
import { expect, haveResource } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { sesUser } from '../src';

test('addUser', () => {
  const stack = new cdk.Stack();
  new sesUser(stack, 'User');
  expect(stack).to(haveResource('AWS::IAM::User'));
});