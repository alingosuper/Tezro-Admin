import * as faceapi from 'face-api.js';

// AI ماڈلز لوڈ کرنا (انٹرنیٹ سے ایک بار لوڈ ہوں گے)
export const loadAIModels = async () => {
  const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';
  await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
  await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
  await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
  console.log("🛡️ Tezro AI Shield: Models Loaded");
};

// دو تصاویر کو میچ کرنا
export const matchFaces = async (selfieUrl, cnicUrl) => {
  try {
    // تصاویر کو HTML ایلیمنٹ میں بدلنا
    const selfieImg = await faceapi.fetchImage(selfieUrl);
    const cnicImg = await faceapi.fetchImage(cnicUrl);

    // چہروں کا پتہ لگانا اور ان کا 'سگنیچر' (Descriptor) نکالنا
    const selfieDesc = await faceapi.allFacesSsdMobilenetv1(selfieImg);
    const cnicDesc = await faceapi.allFacesSsdMobilenetv1(cnicImg);

    if (selfieDesc.length === 0 || cnicDesc.length === 0) {
      return { score: 0, message: "❌ کسی ایک تصویر میں چہرہ واضح نہیں ہے۔" };
    }

    // چہروں کا موازنہ کرنا
    const distance = faceapi.euclideanDistance(selfieDesc[0].descriptor, cnicDesc[0].descriptor);
    
    // فاصلہ جتنا کم ہوگا، میچ اتنا زیادہ ہوگا۔
    const matchPercentage = Math.round((1 - distance) * 100);

    if (matchPercentage > 70) {
      return { score: matchPercentage, message: `✅ AI Match: ${matchPercentage}% (محفوظ)`, safe: true };
    } else {
      return { score: matchPercentage, message: `⚠️ AI Alert: صرف ${matchPercentage}% میچ۔ مینیول چیک کریں!`, safe: false };
    }
  } catch (error) {
    console.error("AI Error:", error);
    return { score: 0, message: "AI چیک میں مسئلہ آیا۔ مینیول تصدیق کریں۔" };
  }
};
