import { LocalizedString } from '../types/index.js';

export class SafetySupportLayer {
  private static readonly MEDICAL_DISCLAIMER_EN =
    'Activity insights and cognitive games are designed for caregiver support and personal engagement. They do not constitute or replace professional medical evaluation, diagnosis, or clinical treatment.';

  private static readonly MEDICAL_DISCLAIMER_HI =
    'गतिविधि के आंकड़े और स्मृति खेल केवल देखभालकर्ता सहायता और मानसिक सक्रियता के लिए हैं। यह किसी चिकित्सीय जांच, निदान या उपचार का विकल्प नहीं हैं।';

  public static getDisclaimer(lang: 'en' | 'hi' = 'en'): string {
    return lang === 'hi' ? this.MEDICAL_DISCLAIMER_HI : this.MEDICAL_DISCLAIMER_EN;
  }

  public static sanitizeMessage(text: string): string {
    // Prevent anxiety-inducing medical phrases
    return text
      .replace(/dementia test|diagnosis|cognitive decline test|failing score|brain damage/gi, 'memory practice')
      .replace(/score:\s*\d+%/gi, 'Great effort')
      .replace(/failed/gi, 'tried');
  }

  public static getSupportiveAffirmation(isCorrect: boolean, hintsUsed: number): LocalizedString {
    if (isCorrect && hintsUsed === 0) {
      return {
        en: 'Wonderful! That memory is vivid and close to your heart.',
        hi: 'बहुत खूब! यह प्यारी याद आपके दिल के बहुत करीब है।'
      };
    }
    if (isCorrect && hintsUsed > 0) {
      return {
        en: 'Nicely done! A gentle reminder helped bring that warm memory back.',
        hi: 'शाबाश! थोड़ी सी मदद से वह सुंदर याद फिर से ताज़ा हो गई।'
      };
    }
    return {
      en: 'No worries at all. Take your time, we can revisit this memory whenever you like.',
      hi: 'कोई बात नहीं। अपना पूरा समय लीजिए, हम इस प्यारी याद को फिर कभी दोहराएंगे।'
    };
  }

  public static getSupportiveHintIntro(): LocalizedString {
    return {
      en: 'Here is a gentle clue to help you:',
      hi: 'आपकी मदद के लिए एक छोटा सा प्यार भरा संकेत:'
    };
  }
}
