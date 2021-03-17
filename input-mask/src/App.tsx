import React from 'react';

import MaskedInput from './components/MaskedInput';

function App() {
  return (
    <div>
      <MaskedInput placeholder="Digite seu CPF" mask="000.000.000-00" char="0" />
    </div>
  );
}

export default App;
