const fetch = require('node-fetch');

exports.handler = async function (event, context) {
  const { prompt, n } = JSON.parse(event.body);
  
  const apiKey = process.env.OPENAI_API_KEY;

  const requestBody = {
    prompt: prompt,
    n: n,
    size: '512x512',
    response_format: 'b64_json'
  };

  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error('Failed to generate AI images');
    }

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify({ data: data.data })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
