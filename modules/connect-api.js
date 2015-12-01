import React from 'react';
import { History } from 'react-router';

function awaitResult(result) {

  if (result && typeof result.then === 'function') {
    return result;
  }

  if (Array.isArray(result)) {
    return Promise.all(result);
  }

  //if is an object
  const keys = Object.keys(result);
  const values = keys.map((k) => result[k]);
  const promise = Promise.all(values).then((results) => {

    return results.reduce((obj, val, i) => {
      obj[keys[i]] = val;
      return obj;
    }, {});
  });

  return promise;
};

export default function connectData(_mapProps, _mapActions) {
  const mapProps = _mapProps || function () { return {}; };
  const mapActions = _mapActions || function () { return {}; };

  return function (ChildComponent) {

    const HOC = React.createClass({
      mixins: [History],

      contextTypes: {
        api: React.PropTypes.any
      },

      getInitialState() {
        return {
          fetching: true,
          fetched: false,
          actions: {}
        };
      },

      componentDidMount() {
        this.fetchData(this.props);
      },

      fetchData(props) {
        const result = mapProps(this.context.api, props);
        const actions = mapActions(this.context.api, props, this.setState.bind(this), this.history);

        this.setState({ actions: actions });

        awaitResult(result)
          .then((data) => {
            this.setState(Object.assign({
              fetching: false,
              fetched: false
            }, data));
          })
          .catch((err) => {
            this.setState({
              fetching: false,
              fetched: false,
              fetchError: err.message
            });
          });

      },

      componentWillReceiveProps(newProps) {
        this.fetchData(newProps);
      },

      render() {
        return (<ChildComponent {...this.props} {...this.state} api={this.context.api} />);
      }
    });

    return HOC;
  };
};
