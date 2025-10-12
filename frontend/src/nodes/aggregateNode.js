// aggregateNode.js - Node for aggregating data

import { BaseNode } from './BaseNode';

export const AggregateNode = ({ id, data }) => {
  const config = {
    type: 'Aggregate',
    fields: [
      {
        name: 'method',
        label: 'Method',
        type: 'select',
        defaultValue: 'sum',
        options: [
          { value: 'sum', label: 'Sum' },
          { value: 'average', label: 'Average' },
          { value: 'count', label: 'Count' },
          { value: 'min', label: 'Minimum' },
          { value: 'max', label: 'Maximum' }
        ]
      }
    ],
    handles: {
      inputs: [
        { id: 'data1', top: '33%' },
        { id: 'data2', top: '66%' }
      ],
      outputs: [{ id: 'result' }]
    },
    content: 'Aggregate multiple data sources',
    style: {
      borderColor: '#EC4899',
      headerColor: '#DB2777',
      backgroundColor: '#FDF2F8'
    }
  };

  return <BaseNode id={id} data={data} config={config} />;
};
