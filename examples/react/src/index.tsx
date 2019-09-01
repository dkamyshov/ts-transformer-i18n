import * as React from 'react';
import * as ReactDOM from 'react-dom';

let container = document.getElementById('root');

if (!container) {
  container = document.createElement('div');
  container.id = 'root';
  document.body.appendChild(container);
}

ReactDOM.render(
  <div>
    {_T('language')}: {_T('greeting')}
  </div>,
  container
);
