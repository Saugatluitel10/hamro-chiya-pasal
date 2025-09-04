// Seed tea categories used as a fallback until MongoDB is connected

/**
 * Category shape:
 * {
 *   key: string,
 *   titleNepali: string,
 *   titleEnglish: string,
 *   teas: Array<{
 *     titleNepali: string,
 *     titleEnglish: string,
 *     priceNpr: number,
 *     imageUrl?: string,
 *     ingredients?: string[],
 *     healthBenefits?: string[],
 *     difficulty?: 'Easy'|'Medium'|'Hard',
 *     seasonal?: boolean,
 *   }>
 * }
 */

function getSeedCategories() {
  return [
    {
      key: 'traditional',
      titleNepali: 'पारम्परिक चिया',
      titleEnglish: 'Traditional Teas',
      teas: [
        {
          titleNepali: 'दूध चिया',
          titleEnglish: 'Dudh Chiya',
          priceNpr: 25,
          imageUrl:
            'https://images.unsplash.com/photo-1542444459-48fa3000b004?q=80&w=1200&auto=format&fit=crop',
          ingredients: ['दूध', 'कालो चिया', 'चिनी'],
          healthBenefits: ['ऊर्जा', 'आराम'],
          difficulty: 'Easy',
        },
        {
          titleNepali: 'कालो चिया',
          titleEnglish: 'Kalo Chiya',
          priceNpr: 20,
          imageUrl:
            'https://images.unsplash.com/photo-1523906921802-b5d2d899e93b?q=80&w=1200&auto=format&fit=crop',
          ingredients: ['कालो चिया', 'तातो पानी'],
          healthBenefits: ['एन्टिअक्सिडेन्ट'],
          difficulty: 'Easy',
        },
        {
          titleNepali: 'अदरक चिया',
          titleEnglish: 'Adrak Chiya',
          priceNpr: 30,
          imageUrl:
            'https://images.unsplash.com/photo-1464347744102-11db6282f854?q=80&w=1200&auto=format&fit=crop',
          ingredients: ['अदरक', 'दूध', 'चिया पत्ती'],
          healthBenefits: ['घाँटी दुखाइको राहत', 'ताप घटाउँछ'],
          difficulty: 'Medium',
        },
      ],
    },
    {
      key: 'premium',
      titleNepali: 'प्रीमियम चिया',
      titleEnglish: 'Premium Teas',
      teas: [
        {
          titleNepali: 'इलाम गोल्ड',
          titleEnglish: 'Ilam Gold',
          priceNpr: 50,
          imageUrl:
            'https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=1200&auto=format&fit=crop',
          ingredients: ['उच्च गुणस्तरको पत्ती'],
          healthBenefits: ['समृद्ध स्वाद', 'एरोमा'],
          difficulty: 'Medium',
          seasonal: false,
        },
        {
          titleNepali: 'हिमालयन ग्रीन',
          titleEnglish: 'Himalayan Green',
          priceNpr: 45,
          imageUrl:
            'https://images.unsplash.com/photo-1517089596392-fb9a9033e05b?q=80&w=1200&auto=format&fit=crop',
          ingredients: ['ग्रीन टी'],
          healthBenefits: ['डिटक्स', 'मेटाबोलिज्म'],
          difficulty: 'Medium',
        },
        {
          titleNepali: 'सिल्भर टिप्स',
          titleEnglish: 'Silver Tips',
          priceNpr: 60,
          imageUrl:
            'https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=1200&auto=format&fit=crop',
          ingredients: ['बड्स मात्र'],
          healthBenefits: ['हल्का र सुगन्धित'],
          difficulty: 'Hard',
          seasonal: true,
        },
      ],
    },
    {
      key: 'herbal',
      titleNepali: 'जडिबुटी चिया',
      titleEnglish: 'Herbal Teas',
      teas: [
        {
          titleNepali: 'तुलसी चिया',
          titleEnglish: 'Tulsi Tea',
          priceNpr: 30,
          imageUrl:
            'https://images.unsplash.com/photo-1542806100-91272a208e38?q=80&w=1200&auto=format&fit=crop',
          ingredients: ['तुलसी', 'मधु (वैकल्पिक)'],
          healthBenefits: ['सर्दी-खोकीमा लाभदायक'],
          difficulty: 'Easy',
        },
        {
          titleNepali: 'नेटल चिया',
          titleEnglish: 'Nettle Tea',
          priceNpr: 35,
          imageUrl:
            'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop',
          ingredients: ['नेटल पात'],
          healthBenefits: ['खनिज तत्वले भरिपूर्ण'],
          difficulty: 'Medium',
          seasonal: true,
        },
        {
          titleNepali: 'लेमन ग्रास',
          titleEnglish: 'Lemon Grass',
          priceNpr: 25,
          imageUrl:
            'https://images.unsplash.com/photo-1598184277221-37d4f243c38b?q=80&w=1200&auto=format&fit=crop',
          ingredients: ['लेमन ग्रास', 'मधु (वैकल्पिक)'],
          healthBenefits: ['सुगन्धित, शान्तिदायक'],
          difficulty: 'Easy',
          seasonal: false,
        },
      ],
    },
  ]
}

module.exports = { getSeedCategories }
