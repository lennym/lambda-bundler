# lambda-bundler

Script to deploy lambda functions to AWS from the command line

## Usage

Simply run from your project root directory:

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

Configuration of AWS credentials is done via environment variables. The following environment variables are required:

```
export AWS_ACCESS_KEY_ID=[redacted]
export AWS_SECRET_ACCESS_KEY=[redacted]
export AWS_IAM_ROLE=[redacted]
```

You may wish to keep these in a `.env` file in your project (**which you should add to .gitignore and NOT check into source control**). If you wish to load environment variables from a `.env` file then these can be loaded automatically by running:

```shell
lamdbda-bundler --env .env
```

## Options

All options can be passed as command line flags

Example:

```shell
lambda-bundler --name "my-lambda-name"
```

