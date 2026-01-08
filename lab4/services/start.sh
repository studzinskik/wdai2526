set -e

BASE_DIR="$(cd "$(dirname "$0")" && pwd)"

start_service () {
  NAME=$1
  DIR=$2
  PORT=$3

  (cd "$BASE_DIR/$DIR" && npm install >/dev/null 2>&1 && node index.js &) 
}

start_service "Users service" "users" 3003
start_service "Books service" "books" 3001
start_service "Orders service" "orders" 3002

wait
