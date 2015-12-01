# Simple data-loading for React

This is not meant to replace something like a flux architecture as an app grows, but more to provide a starting point for simple data loading.

A higher-order-component, wraps "Page" components and describe their data requirements as a promise, or object of `keys => promises`.

Currently assumes you are using react router.

## Example

### In your app.js or wherever

```javascript
import React from 'react';
import ReactDOM from 'react-dom';

import { ApiProvider } from 'async-data-loader';
import HatsIndexPage from './pages/hats-index';

let api = new SomeApiWrapperForCurrentUser();

ReactDOM.render(
  <ApiProvider api={api}>
    <Router history={history}
      <Route path='/' component={HatsIndexPage} />
      //...routes
    </Router>
  </ApiProvider>
, document.getElementById('app'));
```

### In a "page" component

```javascript
import React from 'react';
import { connectApi } from 'async-data-loader';

const HatsIndex = React.createClass({
  render() {
    let { hats, fetching, fetchError } = this.props;

    // while data is still loading, fetching will be true
    if (fetching) {
      return (<p>Loading</p>);
    }

    // if any promises error, this will be set
    if (fetchError) {
      return (<p>Loading error: {fetchError}</p>);
    }

    // once all loaded, your props will be available
    return (
      <div>
        <h1>Hats:</h1>
        <ul>
          { hats.map(hat => (
            <li>{hat.id}: {hat.name} - {hat.color}</li>
          ))}
        </ul>
      </div>
    );
  }
});

//connectApi takes two arguments, mapProps, mapActions

// mapProps should be a function which receives the api, and the page's original props, and returns a promise of an object, or an object of promises, for the data to load:

// api - is as injected by ApiProvider
// props - is as passed from the router/renderer
// each key of the object returned here will be set as a prop on the page, once promises have resolved
let mapProps = function (api, props) {
  return {
    hats: api.fetch('/hats') // promises as object values will be resolved before being passed as props
  };
}

// lets come back to this
let mapActions = null;

export default connectApi(mapProps, mapActions)(HatsIndex);
```
