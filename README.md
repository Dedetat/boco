# BoCo - Bon Compte
> Les bons comptes font les bons amis

This project is something we wrote with [@delphinemillet](https://github.com/delphinemillet) and [@fabienjuif](https://github.com/fabienjuif) to handle our common Fortuneo account.

This project can inspired you, but it doesn't aim to be publicly exposed.

## Installation
This project use `pnpm`, you can install dependencies likes this:
 ```sh
 pnpm install
 ```

 Or like this if you don't want to install pnpm:
 ```sh
 npx pnpm install
 ```

## Start localy
You have to start mongodb:
```sh
docker-compose up -d
```

Then you have to write your own *env.sh* file, you can take a look to [env.template.sh](./env.template.sh) for inspiration.

Finally, you have to start the node application:
```sh
npm start
```

## API

| method | uri | description |
| -- | -- | -- |
| `GET` | `/api/solde` | get current solde |
