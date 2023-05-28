# Getting Started with repo-view app

## Available Scripts

In the project directory, you can run:

### `npm install` or `yarn install`

Installs the packages.

### `npm start` or `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test` or `yarn test`

Runs the unit tests.

## NOTE

Before you run the app you must create the `.env.development.local` file at the top level file hierarchy (like this one).

Inside it add your personal access token: `REACT_APP_PERSONAL_ACCESS_TOKEN = 'YOUR_PERSONAL_ACCESS_TOKEN'`
If you don't have it, you can create it from here: https://github.com/settings/tokens?type=beta

This should be added in order to authenticate the requests with a GitHub personal access token to increase the rate limit. Authenticating with a personal access token allows making authenticated requests with a higher rate limit so no error occurs.
