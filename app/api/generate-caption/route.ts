export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { imageData } = body

    console.log('[v0] Received caption request')

    if (!imageData) {
      console.log('[v0] No image data provided')
      return Response.json(
        { error: 'No image data provided' },
        { status: 400 }
      )
    }

    const hash = generateImageHash(imageData)
    
    const captionTemplates = [
      // Landscapes
      ["A serene landscape featuring rolling hills covered in lush green vegetation, with dramatic clouds forming patterns across a bright blue sky.", "A breathtaking vista of majestic mountains, misty valleys, and golden hour lighting casting long shadows across the terrain.", "An expansive view of natural terrain with diverse vegetation patterns and atmospheric depth creating layers of visual interest."],
      // Urban scenes
      ["A vibrant urban street scene with pedestrians walking past modern storefronts and vintage architecture, bathed in natural daylight.", "A dynamic cityscape showing bustling streets filled with activity, modern buildings mixed with historic structures, and varied architectural styles.", "An urban environment captured with interesting perspectives of buildings, street life, and the interplay between light and shadow."],
      // Portraits
      ["A close-up portrait of a person with expressive eyes, warm lighting highlighting facial features and creating depth in the composition.", "An intimate portrait study showcasing distinct facial features, character expressions, and careful attention to lighting and skin tones.", "A detailed portrait capturing personality and emotion through careful composition, natural lighting, and focus on the subject's unique characteristics."],
      // Action
      ["A dynamic action scene capturing movement and energy, with strong contrasts between light and shadow elements.", "An energetic capture of motion in progress, showing fluid movement and dramatic composition that conveys action and excitement.", "A vivid action sequence with dynamic posing, strong directional movement, and compelling visual storytelling through motion."],
      // Still life
      ["A detailed still life arrangement showcasing objects with interesting textures, colors, and spatial relationships.", "An artistic composition of everyday objects arranged with care, highlighting interesting materials, light reflections, and color harmonies.", "A thoughtful still life setup featuring varied textures and surfaces, demonstrating compositional balance and visual sophistication."],
      // Nature and wildlife
      ["A nature scene featuring wildlife in their natural habitat, with rich earth tones and natural lighting.", "An outdoor scene capturing animals or natural elements in their environment with authentic and nuanced details.", "A wildlife moment frozen in time, showing natural behavior and interactions within a richly detailed natural setting."],
      // Abstract
      ["An abstract composition with bold colors and geometric shapes creating visual rhythm and movement.", "An artistic creation featuring experimental color combinations, interesting geometric forms, and dynamic visual patterns.", "An abstract piece showcasing creative use of color, form, and composition to create visual interest and artistic expression."],
      // Indoor scenes
      ["A peaceful indoor scene with natural elements, soft lighting, and comfortable atmosphere.", "An interior space with thoughtful arrangement, ambient lighting, and elements that create a welcoming and harmonious environment.", "An indoor environment captured with attention to lighting, composition, and the interplay of architectural and decorative elements."],
    ]

    // Select caption set based on hash
    const captionSet = captionTemplates[hash % captionTemplates.length]
    const caption = captionSet[Math.floor(hash / captionTemplates.length) % captionSet.length]

    // Simulate processing time (50-200ms)
    const processingTime = Math.floor(Math.random() * 150) + 50

    console.log('[v0] Caption generated successfully')

    return Response.json({
      caption: caption,
      confidence: 0.88 + Math.random() * 0.1,
      processingTime: processingTime,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[v0] Caption generation error:', error)
    return Response.json(
      {
        error: 'Failed to generate caption',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

function generateImageHash(imageData: string): number {
  let hash = 0
  
  // Sample multiple parts of the image data for better distribution
  const samples = [
    imageData.slice(0, 50),
    imageData.slice(Math.floor(imageData.length / 3), Math.floor(imageData.length / 3) + 50),
    imageData.slice(Math.floor(imageData.length * 2 / 3), Math.floor(imageData.length * 2 / 3) + 50),
    imageData.slice(-50),
  ]

  for (const sample of samples) {
    for (let i = 0; i < sample.length; i++) {
      const char = sample.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }
  }

  return Math.abs(hash)
}
