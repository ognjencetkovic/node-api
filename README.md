
# About

  

The Imprimo API is the backend framework to manage the REST API endpoints, controllers, business services and database models so that a client app can be authenticated/authorized to gain access to the resources that are compliant to a certain set of access rules.
  

# Setup

  

-  `yarn install`
-  `yarn build`
-  `yarn start`

  

# Run

  

-  `GET localhost:3000/application/health`

  

### Application parts below are flagged like this:

  

- 📒 Folders

- 📑 Files

  

### Project architecture:

  

- 📒 src

	- 📒 bl

		- 📑 index.ts

	- 📒 core

		- 📒 enums

		- 📒 interfaces

		- 📒 router

		- 📒 validators

		- 📑 config.ts

	- 📒 dal

		- 📒 migrations

		- 📒 models

		- 📒 repositories

		- 📒 seeds

		- 📒 sql

		- 📑 index.ts

	- 📒 endpoints

	- 📒 libs

	- 📑 app.ts

- 📒 test

- 📑 package.json

- 📑 README.md

  

### How to add a new route:

  

- Add SQL file in "src/dal/sql/{{feature_folder}}/{{file_name}}.sql".

- Export the file and make it usable. This is done in "src/dal/sql/index.ts" by adding a new function which will return loaded SQL file as string.

* After SQL file is loaded, use it in repositories ("src/dal/repositories/{{file_name}}.ts"). Here, use one of the query functions exposed by DAL module and execute our query. The functions are:

  

1. "execQuery" - This will return SELECT with all rows affected by query.

2. "execQuerySingle" - This will return only one row from DB.

  

- Add a new controller under "src/endpoints". Routes are separated in groups, so for example "auth" (routes regarding authorization, "/login", "/register"...), "users" (routes regarding users, "/profile"...) etc. First part of the route should be folder name, so for example in folder "auth", route for login should be: "/auth/login". In that folder add a following files:

  

#### Controller files

  

- Single controller can/should have following files:

  

1. "executor.ts" - Required. This is the main entry point of the route. It has to export one single function: "execute" where the implementation goes.

  

2. "config.ts" - Required. This is where the description of the endpoint is. It needs to export constant the implements IConfig interface. 

3. "request.ts" - Validation schema for requests. It can validate data in body, header, query params...
  
4. "response.js" - Same as above, but for validating response data.

  

## Environment file

  

Make sure to have a `.env` file with appropriate ENV variables. You can duplicate the `local.env.tmpl` file. W `dotenv` is used to load ENV variables into our configuration instance.

  

## Prettier and ESLint

  

Install Visual Studio Code extensions:

  

-  [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

-  [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
