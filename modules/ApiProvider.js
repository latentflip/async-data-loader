import React from 'react';


export default React.createClass({
  childContextTypes: {
    api: React.PropTypes.any
  },

  getChildContext() {
    return {
      api: this.props.api
    };
  },

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
});