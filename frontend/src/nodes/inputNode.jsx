// inputNode.js

import { BaseNode } from './BaseNode';

export const InputNode = ({ id, data }) => {
  const config = {
    type: 'Input',
    fields: [
      {
        name: 'inputName',
        label: 'Name',
        type: 'text',
        defaultValue: id.replace('customInput-', 'input_'),
        placeholder: 'Enter input name'
      },
      {
        name: 'inputType',
        label: 'Type',
        type: 'select',
        defaultValue: 'Text',
        options: [
          { value: 'Text', label: 'Text' },
          { value: 'File', label: 'File' }
        ]
      }
    ],
    handles: {
      inputs: [],
      outputs: [{ id: 'value' }]
    },
    style: {
      borderColor: '#10B981',
      headerColor: '#059669',
      backgroundColor: '#F0FDF4'
    }
  };

  return <BaseNode id={id} data={data} config={config} />;
};
