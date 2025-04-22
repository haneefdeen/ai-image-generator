const generateBtn = document.querySelector('.generate-btn');
const imageGallery = document.querySelector('.image-gallery');
let isImageGenerating = false;

const updateImageCard = (imageData) => {
  const imgCardMarkup = imageData.map((imgObject) => {
    const aiGeneratedImage = `data:image/jpeg;base64,${imgObject.b64_json}`;
    return `
      <div class="img-card">
        <img src="${aiGeneratedImage}" alt="AI generated image">
        <a class="download-btn" href="${aiGeneratedImage}" download>
          <img src="images/download.svg" alt="download icon">
        </a>
      </div>
    `;
  }).join('');
  imageGallery.innerHTML = imgCardMarkup;
};

const generateAiImages = async (userPrompt, userImgQuantity) => {
  try {
    const response = await fetch('/.netlify/functions/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: userPrompt,
        n: userImgQuantity
      }),
    });

    if (!response.ok) throw new Error('Failed to generate AI images.');

    const { data } = await response.json();
    updateImageCard(data);
  } catch (error) {
    alert(error.message);
  } finally {
    generateBtn.removeAttribute('disabled');
    generateBtn.innerText = 'Generate';
    isImageGenerating = false;
  }
};

const handleImageGeneration = (e) => {
  e.preventDefault();
  if (isImageGenerating) return;

  const promptInput = document.querySelector('.prompt-input');
  const imgQuantity = document.querySelector('.img-quantity').value;
  const prompt = promptInput.value;

  if (!prompt) return alert('Please enter a prompt.');

  isImageGenerating = true;
  generateBtn.setAttribute('disabled', 'true');
  generateBtn.innerText = 'Generating...';

  generateAiImages(prompt, imgQuantity);
};

document.querySelector('.generate-form').addEventListener('submit', handleImageGeneration);
