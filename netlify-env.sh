mkdir aws
cd aws
cat > credentials <<EOL
[netlify]
region = $ENV_AWS_REGION
aws_secret_access_key = $ENV_AWS_SECRET_ACCESS_KEY
aws_access_key_id = $ENV_AWS_ACCESS_KEY_ID
EOL