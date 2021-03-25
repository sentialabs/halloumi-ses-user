# Halloumi SES User

Library used to create IAM Users and generates the password to use the AWS Simple Email Service (SES).

## Usage

```typescript
import * as cdk from '@aws-cdk/core';
import * as halloumiSesUser from 'halloumi-ses-user';

export class SesUserStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    new halloumiSesUser.SesUser(this, 'SESUser');
  }
}
```

For more information, please check the [API Doc](API.md)