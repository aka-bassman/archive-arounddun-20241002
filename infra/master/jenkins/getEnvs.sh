#!/bin/bash
REPO_NAME="archive-arounddun-20241002"
SECRET_MAP=( \
"apps/syrs/env/env.server.testing.ts,$REPO_NAME-syrs-server-env-testing,testing" \
"apps/syrs/env/env.server.develop.ts,$REPO_NAME-syrs-server-env-develop,develop" \
"apps/syrs/env/env.server.debug.ts,$REPO_NAME-syrs-server-env-debug,debug" \
"apps/syrs/env/env.server.main.ts,$REPO_NAME-syrs-server-env-main,main" \
"apps/syrs/env/env.client.testing.ts,$REPO_NAME-syrs-client-env-testing,testing" \
"apps/syrs/env/env.client.debug.ts,$REPO_NAME-syrs-client-env-debug,debug" \
"apps/syrs/env/env.client.develop.ts,$REPO_NAME-syrs-client-env-develop,develop" \
"apps/syrs/env/env.client.main.ts,$REPO_NAME-syrs-client-env-main,main" \
"libs/shared/env/env.server.testing.ts,$REPO_NAME-shared-server-env-testing,testing" \
"libs/social/env/env.server.testing.ts,$REPO_NAME-social-server-env-testing,testing" \
"libs/util/env/env.server.testing.ts,$REPO_NAME-util-server-env-testing,testing" \
)

for SECRET in ${SECRET_MAP[@]}; do
    echo ${SECRET}
done
exit 0