# lambda-bundler

Utility to deploy lambda functions to AWS from the command line with optional middleware.

## Usage

First, ensure your project's `main` module in question exports a lambda function. That is, your module looks something like:

```javascript
module.exports = function (event, context, callback) {
  /*...*/
}
```

And if you have not already, [ensure that your AWS credentials are correctly configured](#configuration).

Then you can simply run from your project root directory to deploy your lambda to AWS:

```shell
npm install -g lambda-bundler
lambda-bundler
```

Alternatively, install as a local dependency to your project and alias to an npm script:

```shell
npm install --save-dev lambda-bundler
```

And in your package.json add the following to your `"scripts"`:

```
"deploy": "lambda-bundler"
```

Then you can run:

```shell
npm run deploy
```

## Configuration

Configuration of AWS credentials is done via environment variables. The following environment variables are required as a minimum:

```
export AWS_ACCESS_KEY_ID=[redacted]
export AWS_SECRET_ACCESS_KEY=[redacted]
export AWS_IAM_ROLE=[redacted]
```

Additionally, the [region option](#region) can be configured with an environment variable of `AWS_REGION`.

You may wish to keep these in a `.env` file in your project (**which you should add to .gitignore and NOT check into source control**). If you wish to load environment variables from a `.env` file then these can be loaded automatically by running:

```shell
lamdbda-bundler --env .env
```

## Options

All options can be passed as command line flags or defined in a `lambda-bundler` section of your package.json.

### name

`String` - Defines the `FunctionName` of your lambda in AWS

Default: the name of your module as defined in package.json

### description

`String` - Defines the decription of your lambda in AWS

Default: the description of your module as defined in package.json

### files

`Array|String` - List of file names (or globs) to be uploaded to AWS as your lambda

Default: `['**/*.js']`

Note: `package.json` is *always* included in your bundle

### ignore

`Array|String` - List of file names (or globs) of files to be excluded from the bundle

Default: `[]`

Note: `node_modules` is *always* ignored

### ignoreFile

`String` - Path to an ignore file

Default: `'.lambdaignore'`

Note: Passing a value of `'git'` or `'npm'` will use `.gitignore` and `.npmignore` respectively.

### region

`String` - AWS region to load lambda into

Default: `process.env.AWS_REGION`

### role

`String` - AWS IAM role to use for created lambda

Default: `process.env.AWS_IAM_ROLE`

### envfile

`Boolean|String` - If set, writes the current set of environment variables to a file and includes it in the bundle. If A string is passed then this defines the filename environment variables will be written to.

Default: false - if set to a truthy, non-string then defaults to `'.env'`.

## Middleware

You can define additional middleware functions to be called before your lambda function to provide common reusable functionality across lambdas in a seamless way.

These are called with the same method signature as a lambda function, and can be synchronous or asynchronous - e.g.

```javascript
function (event, context, callback) {
  /* your code here */
  callback();
}
```

With the caveat that a middleware cannot return a value through its callback, only the first (error) argument to the callback is used, and passing an error will terminate execution of the middleware stack, and in turn the lambda.

These can be defined in your package.json as a `middleware` property of the `lambda-bundler` options. Middleware can be defined as module paths, either to local or npm modules, and are executed in the order that they are defined.

Example:

```json
{
  ...
  "lambda-bundler": {
    "files": [...],
    "middleware": [
      "./my-local-middleware",
      "npm-module-as-middleware"
    ]
  }
}
```

Note: modules should export the middleware function directly.