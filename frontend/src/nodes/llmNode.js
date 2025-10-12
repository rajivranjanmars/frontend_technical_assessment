// llmNode.js

import { BaseNode } from './BaseNode';

export const LLMNode = ({ id, data }) => {
  const config = {
    type: 'LLM',
    fields: [],
    handles: {
      inputs: [
        { id: 'system', top: '33%' },
        { id: 'prompt', top: '66%' }
      ],
      outputs: [{ id: 'response' }]
    },
    content: 'This is a Language Model.',
    style: {
      borderColor: '#8B5CF6',
      headerColor: '#7C3AED',
      backgroundColor: '#F5F3FF'
    }
  };

  return <BaseNode id={id} data={data} config={config} />;
};
