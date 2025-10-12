// transformNode.js - Node for data transformation

import { BaseNode } from './BaseNode';

export const TransformNode = ({ id, data }) => {
  const config = {
    type: 'Transform',
    fields: [
      {
        name: 'operation',
        label: 'Operation',
        type: 'select',
        defaultValue: 'uppercase',
        options: [
          { value: 'uppercase', label: 'Uppercase' },
          { value: 'lowercase', label: 'Lowercase' },
          { value: 'trim', label: 'Trim' },
          { value: 'reverse', label: 'Reverse' }
        ]
      }
    ],
    handles: {
      inputs: [{ id: 'input' }],
      outputs: [{ id: 'output' }]
    },
    content: 'Transform text data',
    style: {
      borderColor: '#F59E0B',
      headerColor: '#D97706',
      backgroundColor: '#FFFBEB'
    }
  };

  return <BaseNode id={id} data={data} config={config} />;
};
