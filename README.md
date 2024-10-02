# Info

이 모노리포는 퍼핀플래닛 협력사의 모든 소스코드를 포함하고 있으며, 모든 코드는 비밀정보로 관리됩니다.

## Prerequisite

본 프로젝트를 사용하기 위해서는, 사전에 bassman#4247에게 협의 후 ssh publickey 등록이 필요합니다.
연락처: 퍼핀플래닛 주식회사 선강민 이사 / 010-7445-3714 / seon@puffinplace.com

## Get Started

Run the code below.

```
npm run downloadEnv # Need to register your public key

npm i -g nx pnpm

pnpm i -w

cat <<EOF >> .env
# ENV For Server => local | debug | develop | main
SERVER_ENV=debug.local
# Run Mode For Server => federation | batch | all
SERVER_MODE=federation
# ENV For Client => local | debug | develop | main
NEXT_PUBLIC_CLIENT_ENV=debug.local
ANALYZE=false
EOF

nx serve-backend syrs
# or nx serve-frontend syrs, etc
```
