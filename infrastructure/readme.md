# Infrastructure
Terraform code that sets up S3 bucket and MySQL (RDS) Database.

## How to run
```
Terraform apply
```

## Note
Make sure the correct variables are set in `*.tfvars`.
```bash
aws_access_key = "YOUR_AWS_ACCESS_KEY"
aws_secret_access_key = "YOUR_AWS_SECRET_ACCESS_KEY"
```
