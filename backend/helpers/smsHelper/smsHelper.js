import AWS from "aws-sdk"

export const sendSms = async (phone, text) =>
{
    AWS.config.update({
        region: process.env.AWS_REGION,
        apiVersion: 'latest',
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_ID,
        }
      });
    var params = {
        Message: text, PhoneNumber:phone
    };
    return new AWS.SNS().publish(params).promise().then(()=>console.log("message sended")).catch(err => console.log(err));
}