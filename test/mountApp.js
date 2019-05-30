import React from 'react'
import ReactDOM from 'react-dom'

let div

export default function mountApp (Component, props) {
  if (div) {
    ReactDOM.unmountComponentAtNode(div)
    div.parentNode.removeChild(div)
  }

  div = document.createElement('div')
  document.body.appendChild(div)
  ReactDOM.render(React.createElement(Component, props), div)
}
