# Terraform configuration for Resume Intelligence Platform infrastructure
# This can be used to provision cloud infrastructure (AWS, GCP, Azure)

terraform {
  required_version = ">= 1.0"
  
  required_providers {
    # Uncomment and configure based on your cloud provider
    # aws = {
    #   source  = "hashicorp/aws"
    #   version = "~> 5.0"
    # }
    # google = {
    #   source  = "hashicorp/google"
    #   version = "~> 5.0"
    # }
  }
}

# Variables
variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "prod"
}

variable "region" {
  description = "Cloud region"
  type        = string
  default     = "us-east-1"
}

# Example: RDS PostgreSQL instance
# resource "aws_db_instance" "postgres" {
#   identifier     = "resume-platform-postgres-${var.environment}"
#   engine         = "postgres"
#   engine_version = "15.4"
#   instance_class = "db.t3.medium"
#   allocated_storage = 100
#   storage_type   = "gp3"
#   
#   db_name  = "resume_db"
#   username = var.db_username
#   password = var.db_password
#   
#   vpc_security_group_ids = [aws_security_group.rds.id]
#   db_subnet_group_name   = aws_db_subnet_group.main.name
#   
#   backup_retention_period = 7
#   backup_window          = "03:00-04:00"
#   maintenance_window     = "mon:04:00-mon:05:00"
#   
#   skip_final_snapshot = var.environment != "prod"
#   final_snapshot_identifier = "resume-platform-postgres-${var.environment}-final"
# }

# Example: ElastiCache Redis
# resource "aws_elasticache_cluster" "redis" {
#   cluster_id           = "resume-platform-redis-${var.environment}"
#   engine               = "redis"
#   node_type            = "cache.t3.medium"
#   num_cache_nodes      = 1
#   parameter_group_name = "default.redis7"
#   port                 = 6379
#   subnet_group_name    = aws_elasticache_subnet_group.main.name
#   security_group_ids   = [aws_security_group.redis.id]
# }

# Example: ECS Cluster for containerized services
# resource "aws_ecs_cluster" "main" {
#   name = "resume-platform-${var.environment}"
#   
#   setting {
#     name  = "containerInsights"
#     value = "enabled"
#   }
# }

# Example: Application Load Balancer
# resource "aws_lb" "main" {
#   name               = "resume-platform-alb-${var.environment}"
#   internal           = false
#   load_balancer_type = "application"
#   security_groups    = [aws_security_group.alb.id]
#   subnets            = var.public_subnet_ids
#   
#   enable_deletion_protection = var.environment == "prod"
# }

# Outputs
# output "postgres_endpoint" {
#   value = aws_db_instance.postgres.endpoint
# }
# 
# output "redis_endpoint" {
#   value = aws_elasticache_cluster.redis.cache_nodes[0].address
# }
