const { Configuration, OpenAIApi } = require("openai");

exports.handler = async function (event, context) {
  const { prompt, n } = JSON.parse(event.body);

  if (!prompt) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Prompt is required." }),
    };
  }

  try {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(configuration);

    const response = await openai.createImage({
      prompt: prompt,
      n: parseInt(n),
      size: "512x512",
      response_format: "b64_json",
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ data: response.data.data }),
    };
  } catch (error) {
    console.error("OpenAI Error:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Image generation failed." }),
    };
  }
};
