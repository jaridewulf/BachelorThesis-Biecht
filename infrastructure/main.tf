terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Configure the AWS Provider
provider "aws" {
  region     = "eu-central-1"
  access_key = var.aws_access_key
  secret_key = var.aws_secret_access_key
}

resource "aws_vpc" "this" {
  cidr_block       = "10.0.0.0/16"
  instance_tenancy = "default"
}

resource "aws_db_instance" "default" {
  allocated_storage    = 10
  db_name              = "mydb"
  engine               = "mysql"
  engine_version       = "5.7"
  instance_class       = "db.t3.micro"
  username             = var.mysql_username
  password             = var.mysql_passwword
  parameter_group_name = "default.mysql5.7"
  skip_final_snapshot  = true
}

# Bucket that will hold the audio files
resource "aws_s3_bucket" "audioBucket" {
  bucket = "debiecht-audio-files"
}