import * as path from 'path';
import { User, UserProps, CfnAccessKey, Role, ServicePrincipal, Effect, PolicyStatement } from '@aws-cdk/aws-iam';
import { Function, Code, Runtime, LayerVersion } from '@aws-cdk/aws-lambda';
import { Construct, Fn, CustomResource } from '@aws-cdk/core';

const RESOURCE_TYPE = 'Custom::HalloumiSesUserPassword';
export class SesUser extends User {
  /**
   * An attribute that represents the user access_key.
   *
   * @attribute true
   */
  readonly accessKey: string;
  /**
   * An attribute that represents the user secret_key.
   *
   * @attribute true
   */
  readonly secretKey: string;
  /**
   * An attribute that represents the user smtp password.
   *
   * @attribute true
   */
  readonly smtpPassword: string;

  constructor(scope: Construct, id: string, props?: UserProps) {
    super(scope, id, props);

    const access_keys = new CfnAccessKey(scope, `${id}AccessKeys`, {
      userName: this.userName,
    });
    const secret_key = Fn.getAtt(access_keys.logicalId, 'SecretAccessKey');

    this.accessKey = access_keys.ref;
    this.secretKey = secret_key.toString();

    const _lambda_role = new Role(scope, `${id}Role`, {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    });
    _lambda_role.addToPrincipalPolicy( new PolicyStatement({
      actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents'],
      effect: Effect.ALLOW,
      resources: ['arn:aws:logs:*:*:*'],
    }));

    const layer_version = new LayerVersion(scope, `${id}Layer`, {
      code: Code.fromAsset(path.join(__dirname, 'crypto.zip')),
    });

    const _lambda_ses_password = new Function(scope, `${id}Function`, {
      code: Code.fromAsset(path.join(__dirname, 'lambda')),
      runtime: Runtime.NODEJS_12_X,
      handler: 'index.on_event',
      role: _lambda_role,
      layers: [layer_version],
    });

    const custom_resource = new CustomResource(scope, `${id}CustomResource`, {
      serviceToken: _lambda_ses_password.functionArn,
      resourceType: RESOURCE_TYPE,
      properties: {
        SecretKey: this.secretKey,
      },
    });

    this.smtpPassword = custom_resource.getAtt('password').toString();
  }
}