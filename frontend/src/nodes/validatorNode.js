// validatorNode.js - Node for data validation

import { BaseNode } from './BaseNode';

export const ValidatorNode = ({ id, data }) => {
  const config = {
    type: 'Validator',
    fields: [
      {
        name: 'validationType',
        label: 'Validation Type',
        type: 'select',
        defaultValue: 'email',
        options: [
          { value: 'email', label: 'Email' },
          { value: 'url', label: 'URL' },
          { value: 'number', label: 'Number' },
          { value: 'regex', label: 'Regex Pattern' }
        ]
      },
      {
        name: 'pattern',
        label: 'Pattern',
        type: 'text',
        defaultValue: '',
        placeholder: 'Optional custom pattern'
      }
    ],
    handles: {
      inputs: [{ id: 'input' }],
      outputs: [
        { id: 'valid', top: '40%' },
        { id: 'invalid', top: '60%' }
      ]
    },
    content: 'Validate input data',
    style: {
      borderColor: '#84CC16',
      headerColor: '#65A30D',
      backgroundColor: '#F7FEE7'
    }
  };

  return <BaseNode id={id} data={data} config={config} />;
};
