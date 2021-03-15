import { User, UserProps, CfnAccessKey } from '@aws-cdk/aws-iam';
import { CfnSecret } from '@aws-cdk/aws-secretsmanager';
import { Construct, Fn } from '@aws-cdk/core';
export class SesUser extends User {
  constructor(scope: Construct, id: string, props?: UserProps) {
    super(scope, id, props);

    const access_keys = new CfnAccessKey(scope, `${id}AccessKeys`, {
      userName: this.userName,
    });

    const secret_key = Fn.getAtt(access_keys.logicalId, 'SecretAccessKey');

    new CfnSecret(scope, `${id}Secret`, {
      secretString: JSON.stringify({
        access_keys: access_keys.ref,
        secret_key: secret_key.toString(),
      }),
    });
  }
}