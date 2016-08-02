module.exports = function () {
  return new Promise((resolve, reject) => {
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      reject(new Error('Invalid AWS credentials are provided. See https://github.com/lennym/lambda-bundler#configuration for more information.'));
    } else {
      resolve();
    }
  });
};
