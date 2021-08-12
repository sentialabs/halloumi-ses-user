const { AwsCdkConstructLibrary, DependenciesUpgradeMechanism } = require('projen');

const project = new AwsCdkConstructLibrary({
  author: 'Sentia',
  authorAddress: 'support.mpc@sentia.com',
  cdkVersion: '1.73.0',
  defaultReleaseBranch: 'main',
  jsiiFqn: 'projen.AwsCdkConstructLibrary',
  name: 'halloumi-ses',
  repositoryUrl: 'https://github.com/sentialabs/halloumi-ses-user.git',

  cdkAssert: true, /* Install the @aws-cdk/assert library? */
  cdkDependencies: [
    '@aws-cdk/aws-iam',
    '@aws-cdk/aws-lambda',
    '@aws-cdk/core',
  ], /* Which AWS CDK modules (those that start with "@aws-cdk/") does this library require when consumed? */
  cdkTestDependencies: undefined, /* AWS CDK modules required for testing. */

  docgen: true, /* Automatically generate API.md from jsii. */
  eslint: true, /* Install eslint. */

  publishToPypi: {
    distName: 'halloumi-ses-user',
    module: 'halloumi_ses_user',
  }, /* Publish to pypi. */

  // description: undefined,                                                    /* The description is just a string that helps people understand the purpose of the package. */
  devDeps: [
    'nock',
    '@types/aws-lambda',
    '@types/rewire',
    'rewire',
  ], /* Build dependencies for this module. */

  license: 'Apache-2.0', /* License's SPDX identifier. */
  licensed: true, /* Indicates if a license should be added. */

  /* NodeProjectOptions */
  antitamper: false, /* Checks that after build there are no modified files on git. */

  jest: true, /* Setup jest unit tests. */
  jestOptions: {
    jestVersion: '26.6.3',
    ignorePatterns: [
      '/node_modules/',
      '/test/utils/',
    ],
    typescriptConfig: {
      compilerOptions: {
        esModuleInterop: true,
      },
    },
  }, /* Jest options. */
  projenUpgradeSecret: 'PROJEN_GITHUB_TOKEN',
  depsUpgrade: DependenciesUpgradeMechanism.githubWorkflow({
    include: ['@aws-cdk/*']
  }),
  gitignore: [
    '.vscode/'
  ]
});

//project.buildTask.exec('esbuild src/lambda/index.ts --bundle --platform=node --target=node12 --external:aws-sdk --outfile=dist/lambda/index.js');
project.compileTask.exec('cp -R src/lambda lib/');

project.synth();
