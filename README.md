# guard-duty-to-slack-lambda

This is a simple, dependnecy free, lambda function that receives findings from AWS GuardDuty and posts them in a designated slack channel.

## Environment Variables

-   `SLACK_WEBHOOK_URL`: The Slack webhook URL for the channel in which the lambda should post
-   `DRY_RUN`: If this is `true` then no slack messages are sent. (Default: `false`)

## Setup

-   Create an incoming slack webhook that points to the channel in which you wish to receive notifications. https://slack.com/apps/A0F7XDUAZ-incoming-webhooks
-   Create a lambda function with the basic execution role and upload this folder as a zip file. You can download it directly from GitHub. Point the handler to `src/index.handler` and extend the timeout to 5 minutes. Set the `SLACK_WEBHOOK_URL` to the URL that was generated in the previous step.
-   Create a CloudWatch event rule to forward GuardDuty findings to this lambda. The event pattern should look something like this:

```
{
    "source": [
        "aws.guardduty"
    ],
    "detail-type": [
        "GuardDuty Finding"
    ],
    "detail": {
        "severity": [
          4.0, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9,
          5.0, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9,
          6.0, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9,
          7.0, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9,
          8.0, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9
        ]
    }
}
```

-   You may want to adjust the severities that will trigger the rule. The given configuration will trigger the lambda on findings with a medium severity or above. More info can be found here: https://docs.aws.amazon.com/guardduty/latest/ug/guardduty_findings.html#guardduty_findings-severity

-   Add the following function policy to the function to allow it to be executed by the CloudWatch event:

```
{
  "Version": "2012-10-17",
  "Id": "default",
  "Statement": [
    {
      "Sid": "AllowExecutionFromCloudWatch",
      "Effect": "Allow",
      "Principal": {
        "Service": "events.amazonaws.com"
      },
      "Action": "lambda:InvokeFunction",
      "Resource": "<lambdaArn>"
    }
  ]
}
```
