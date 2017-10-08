# Cafe CMS - React Client

Cafe is here to supersede clunky content management systems.

### About Cafe CMS

Authored by [the Trioxis team](http://trioxis.com). CafeCMS:

- allows developers to build beautiful progressive web apps
- whilst enabling non-developers to edit copy and content

The admin panel is under development, for now, see the api at [`api.cms.cafe/graphiql`](http://api.cms.cafe/graphiql) to add content.

### About this React Client

The React Cafe Client simplifies usage of Cafe within a react environment. It provides a simple higher order component to inject content.

## Usage
Use npm or yarn:

```shell
npm install @trioxis/react-cafe-cms
```
```shell
yarn add @trioxis/react-cafe-cms
```

### Setup and basic usage

Setup the root provider component at the top level of your app:

```js
import React from 'react';
import {CMSProvider} from '@trioxis/react-cafe-cms';

import MyPage from './MyPage';

function MyApp () {
  return (
    <CMSProvider website='trioxis.com'>
      <MyPage />
    </CMSProvider>
  );
}

export default MyApp;
```

Then inject content into your components using the higher order component:
```js
// ./MyPage
import React from 'react';
import {injectContent} from '@trioxis/react-cafe-cms';

function MyPage (props) {
  const {content} = props
  return (
    <div>
      {content.helloWorld}
    </div>
  );
}

export default injectContent('helloWorld')(MyPage);
```

`content` is an object that will be empty until a response is received from the API.

### How to avoid many round trips

To request all content in a single round trip, we must statically pass up the required content for each component.

```js
// ./MyContent
import React from 'react';
import {injectContent} from '@trioxis/react-cafe-cms';
import {compose, setStatic} from '@trioxis/react-cafe-cms';

const content = ['helloWorld']

function MyContent (props) {
  const {content} = props
  return (
    <div>
      {content.helloWorld}
    </div>
  );
}

export default compose(
  setStatic('content', content),
  injectContent(...content)
)(MyContent);
```

```js
// ./MoreContent
import React from 'react';
import {injectContent} from '@trioxis/react-cafe-cms';
import {compose} from '@trioxis/react-cafe-cms';
import MyContent from './MyContent';

const content = ['suchWow']

function MoreContent (props) {
  const {content} = props
  return (
    <div>
      {content.suchWow}
      <MyContent />
    </div>
  );
}

export default compose(
  injectContent(...content, ...MyContent.content)
)(MoreContent);
```

## Development
To work on the client itself, see the [development readme](./README-dev.md)
