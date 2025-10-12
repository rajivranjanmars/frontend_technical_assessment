// filterNode.js - Node for filtering data

import { BaseNode } from './BaseNode';

export const FilterNode = ({ id, data }) => {
  const config = {
    type: 'Filter',
    fields: [
      {
        name: 'condition',
        label: 'Condition',
        type: 'text',
        defaultValue: '',
        placeholder: 'e.g., length > 5'
      },
      {
        name: 'filterType',
        label: 'Filter Type',
        type: 'select',
        defaultValue: 'include',
        options: [
          { value: 'include', label: 'Include' },
          { value: 'exclude', label: 'Exclude' }
        ]
      }
    ],
    handles: {
      inputs: [{ id: 'data' }],
      outputs: [{ id: 'filtered' }]
    },
    content: 'Filter data based on conditions',
    style: {
      borderColor: '#06B6D4',
      headerColor: '#0891B2',
      backgroundColor: '#ECFEFF'
    }
  };

  return <BaseNode id={id} data={data} config={config} />;
};
