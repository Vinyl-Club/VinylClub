# -----------------------------------------------------------------------------
# Script Name: docker-postgresql-multiple-databases.sh
#
# Description:
#   This script is intended to be used as an entrypoint or initialization script
#   for a PostgreSQL Docker container. It enables the creation of multiple
#   databases during container startup, based on a comma-separated list provided
#   in the environment variable POSTGRES_MULTIPLE_DATABASES.
#
# Usage:
#   Set the following environment variables before running the script:
#     - POSTGRES_USER: The PostgreSQL superuser name (required).
#     - POSTGRES_MULTIPLE_DATABASES: Comma-separated list of database names to create.
#
#   Example:
#     POSTGRES_USER=admin POSTGRES_MULTIPLE_DATABASES=db1,db2,db3 ./docker-postgresql-multiple-databases.sh
#
# Functionality:
#   - For each database name specified in POSTGRES_MULTIPLE_DATABASES:
#       - Creates the database if it does not exist.
#       - Grants all privileges on the new database to the user specified by POSTGRES_USER.
#
# Notes:
#   - The script will exit immediately if any command fails (set -e).
#   - The script will exit if any unset variable is used (set -u).
#   - Should be run with sufficient privileges to execute psql as the PostgreSQL superuser.
# -----------------------------------------------------------------------------
#!/bin/bash

set -e
set -u

function create_user_and_database() {
    local database=$1
    echo "  Creating user and database '$database'"
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
        CREATE DATABASE $database;
        GRANT ALL PRIVILEGES ON DATABASE $database TO $POSTGRES_USER;
EOSQL
}

if [ -n "$POSTGRES_MULTIPLE_DATABASES" ]; then
    echo "Multiple database creation requested: $POSTGRES_MULTIPLE_DATABASES"
    for db in $(echo $POSTGRES_MULTIPLE_DATABASES | tr ',' ' '); do
        create_user_and_database $db
    done
    echo "Multiple databases created"
fi