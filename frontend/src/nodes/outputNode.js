// outputNode.js

import { BaseNode } from './BaseNode';

export const OutputNode = ({ id, data }) => {
  const config = {
    type: 'Output',
    fields: [
      {
        name: 'outputName',
        label: 'Name',
        type: 'text',
        defaultValue: id.replace('customOutput-', 'output_'),
        placeholder: 'Enter output name'
      },
      {
        name: 'outputType',
        label: 'Type',
        type: 'select',
        defaultValue: 'Text',
        options: [
          { value: 'Text', label: 'Text' },
          { value: 'Image', label: 'Image' }
        ]
      }
    ],
    handles: {
      inputs: [{ id: 'value' }],
      outputs: []
    },
    style: {
      borderColor: '#EF4444',
      headerColor: '#DC2626',
      backgroundColor: '#FEF2F2'
    }
  };

  return <BaseNode id={id} data={data} config={config} />;
};
