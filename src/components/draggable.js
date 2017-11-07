import React from 'react';

class Draggable extends React.Component {
  render() {
    return this.props.children ? this.modifyChildren(this.props.children) : null;
  }
  modifyChildren(children) {
    return React.Children.map(children,
      (child) => React.cloneElement(child, {
        draggable:'true'
      })
    );
  }
}
Draggable.defaultProps = {};
export default Draggable;
