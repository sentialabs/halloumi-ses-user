import { User, UserProps } from '@aws-cdk/aws-iam';
import { Construct } from '@aws-cdk/core';
export class sesUser extends User {

  constructor(scope: Construct, id: string, props?: UserProps) {
    super(scope, id, props);
    new User(scope, `${id}SesUser`, props);
  }
}