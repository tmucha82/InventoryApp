#!/usr/bin/env bats
DIR=$(dirname $BATS_TEST_FILENAME)
BGPID=''

load "${NGBOOK_ROOT}/scripts/bats/fullstack.bats"
load "${NGBOOK_ROOT}/scripts/bats-support/load.bash"
load "${NGBOOK_ROOT}/scripts/bats-assert/load.bash"

@test "how_angular_works/inventory_app e2e passses" {
  cd $DIR
  run ./node_modules/.bin/protractor
  assert_output --partial 'SUCCESS'
}

setup() {
  echo "travis_fold:start:how_angular_works/inventory_app"
  cd $DIR
  kill_by_port 8080
  kill_by_grep "concurrent"
  npm run go 3>- &
  BGPID=$!
  true
}

teardown() {
  cd $DIR
  kill -9 $BGPID || :
  jobs -p | xargs kill -9
  kill_by_grep "concurrent"
  echo "travis_fold:end:how_angular_works/inventory_app"
  true
}
