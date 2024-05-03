
## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation
```
install postgres server
```
```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

````
Test using postman

````

  1. register
   Post localhost:3000/auth/register
       
       body, Json   
        {
            "username" : "test",
            "email" : "test@example.com",
            "password" : "nestjstest1",
            "role" : "admin"
        } 
  2. login

    Post ocalhost:3000/auth/login
        body, Json   
        {
            "email" : "test@example.com",
            "password" : "nestjstest1",
        } 
   3. Creat Cats profile
        header ->  Authorization : Bearer {your token}
        Post localhost:3000/cats
        body, Json   
            {
                "name" : "cat",
                "breed" : "catprofile",
                "age" : 12,
            } 
    4.Get cats profile 
        header ->  Authorization : Bearer {your token}
        Get localhost:3000/cats

    5.Get catprofile by Id
        header ->  Authorization : Bearer {your token}
        Get localhost:3000/cats/{id}

    also can delete and update cats profile




Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).
