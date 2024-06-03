import type { MockMethod } from 'vite-plugin-mock'
export default [
  {
    url: '/engula/byoc/credential/list',
    method: 'get',
    timeout: 900,
    response: () => {
      return {
        'list|3-5': [
          {
            'id|+1': 1,
            'cloudProvider|1': ['aws', 'azure', 'alibaba'],
            'version|1': ['1.28', '1.26', '2.01', '1.03', '1.11'],
            name: '@word',
            ak: '@word',
            createTime: '@datetime',
            assumeRoleArn: '@word',
            isDefault: false,
          },
        ],
      }
    },
  },
  {
    url: '/engula/byoc/credential/cloud-provider/config/names',
    method: 'get',
    response: () => {
      return {
        list: ['aliyun', 'aws', 'azure'],
      }
    },
  },
  {
    url: '/engula/byoc/credential/add',
    method: 'put',
    response: () => {
      return {
        'credentialId|+1': 1,
      }
    },
  },
  {
    url: '/engula/byoc/credential/assume-role/shell/tpl',
    method: 'get',
    response: () => {
      return `cat >CreateMontCache-Trust-Policy.json <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
    {
        "Sid": "Statement1",
        "Effect": "Allow",
        "Principal": {
           "AWS": "arn:aws:iam::891164855293:role/montCacheClientRole"
    },
        "Action": "sts:AssumeRole",
        "Condition": {
          "StringEquals": {
            "sts:ExternalId": "<verifyCode>"
          }
        }
      }
    ]
}
EOF

cat >CreateCache-Permissions-Policy.json <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                            "eks:*",
                            "ec2:*"
                    ],
            "Resource": "*"
        }
    ]
}
EOF
aws iam create-role --role-name CreateMontCache-Role --assume-role-policy-document file://CreateMontCache-Trust-Policy.json

policy_arn=$(aws iam create-policy --policy-name CreateMontCache-policy --policy-document file://CreateCache-Permissions-Policy.json --output text --query Policy.Arn)
aws iam attach-role-policy --role-name CreateMontCache-Role --policy-arn \${policy_arn}\
echo  "" >CreateMontCache-Trust-Policy.json
echo  "" >CreateCache-Permissions-Policy.json
aws iam get-role --role-name CreateMontCache-Role --output text  --query Role.Arn
			`
    },
  },
  {
    url: '/engula/byoc/credential/init',
    method: 'put',
    response: ({ body }) => {
      if (body.credentialId) {
        return { eksClusterId: 12 }
      }
    },
  },
  {
    url: '/engula/byoc/credential/exist',
    method: 'get',
    response: () => {
      return { exist: true }
    },
  },
] as MockMethod[]
