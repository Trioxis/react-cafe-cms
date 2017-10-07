import React, { Component } from 'react';
import {CMSProvider} from '@trioxis/react-cafe-cms';

import Hero from '../Hero';

class App extends Component {
  render() {
    return (
      <CMSProvider website='example-spa'>
        <div>
          <Hero />
          <p>
            To get started, edit <code>src/App.js</code> and save to reload.
          </p>
        </div>
      </CMSProvider>
    );
  }
}

export default App;
