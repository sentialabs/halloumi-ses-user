import { User, UserProps, CfnAccessKey, Role, ServicePrincipal, PolicyStatement, Effect } from '@aws-cdk/aws-iam';
import { CfnSecret } from '@aws-cdk/aws-secretsmanager';
import { Construct, Fn } from '@aws-cdk/core';
export class SesUser extends User {
  constructor(scope: Construct, id: string, props?: UserProps) {
    super(scope, id, props);

    const access_keys = new CfnAccessKey(scope, `${id}AccessKeys`, {
      userName: this.userName,
    });

    const secret_key = Fn.getAtt(access_keys.logicalId, 'SecretAccessKey');

    const secret = new CfnSecret(scope, `${id}Secret`, {
      secretString: JSON.stringify({
        access_keys: access_keys.ref,
        secret_key: secret_key.toString(),
      }),
    });

    const _lambda_role = new Role(scope, `${id}Role`, {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    });

    _lambda_role.addToPrincipalPolicy(new PolicyStatement({
      actions: [
        "secretsmanager:GetResourcePolicy",
        "secretsmanager:GetSecretValue",
        "secretsmanager:DescribeSecret",
        "secretsmanager:ListSecretVersionIds"
      ],
      effect: Effect.ALLOW,
      resources:[
        secret.ref
      ]
    }))
  }
}