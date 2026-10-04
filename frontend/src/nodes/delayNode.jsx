// delayNode.js - Node for adding delays/scheduling

import { BaseNode } from './BaseNode';

export const DelayNode = ({ id, data }) => {
  const config = {
    type: 'Delay',
    fields: [
      {
        name: 'duration',
        label: 'Duration',
        type: 'number',
        defaultValue: 1,
        placeholder: 'Duration in seconds',
        min: 0,
        max: 3600
      },
      {
        name: 'unit',
        label: 'Unit',
        type: 'select',
        defaultValue: 'seconds',
        options: [
          { value: 'seconds', label: 'Seconds' },
          { value: 'minutes', label: 'Minutes' },
          { value: 'hours', label: 'Hours' }
        ]
      }
    ],
    handles: {
      inputs: [{ id: 'trigger' }],
      outputs: [{ id: 'delayed' }]
    },
    content: 'Add delay to pipeline execution',
    style: {
      borderColor: '#6366F1',
      headerColor: '#4F46E5',
      backgroundColor: '#EEF2FF'
    }
  };

  return <BaseNode id={id} data={data} config={config} />;
};
