import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

// Get API key from environment variable
const API_KEY = process.env.GEMINI_API_KEY || ''

// List of models to try in order
const MODELS = ['gemini-2.0-flash']

export async function POST(request: NextRequest) {
  try {
    // Check if request is FormData (file upload) or JSON
    const contentType = request.headers.get('content-type') || ''
    let message = ''
    let file: File | null = null

    if (contentType.includes('multipart/form-data')) {
      // Handle file upload
      const formData = await request.formData()
      message = (formData.get('message') as string) || ''
      const fileData = formData.get('file') as File | null
      
      if (fileData) {
        file = fileData
        // For now, we'll just include file info in the message
        // In a real app, you might want to process the file (e.g., extract text, convert to base64, etc.)
        const fileInfo = `User mengirim file: ${file.name} (${(file.size / 1024).toFixed(1)} KB, tipe: ${file.type})`
        message = message ? `${message}\n\n${fileInfo}` : fileInfo
      }
    } else {
      // Handle JSON request
      const body = await request.json()
      message = body.message || ''
    }

    if (!message && !file) {
      return NextResponse.json(
        { error: 'Message or file is required' },
        { status: 400 }
      )
    }

    if (!API_KEY) {
      console.error('GEMINI_API_KEY is not set in environment variables')
      return NextResponse.json(
        { error: 'API key is not configured. Please set GEMINI_API_KEY in .env.local file.' },
        { status: 500 }
      )
    }

    const genAI = new GoogleGenAI({ apiKey: API_KEY })
    
    // System instruction untuk membuat AI lebih humanis dan menyebutkan identitas sebagai ChatBot AI
    const systemInstruction = `Kamu adalah ChatBot AI yang ramah dan humanis. Identitasmu adalah sebagai ChatBot AI yang siap membantu pengguna dengan cara yang natural dan mudah dipahami.

Panduan penting dalam merespons:
1. Selalu ingat bahwa kamu adalah ChatBot AI yang membantu pengguna dengan ramah dan natural
2. Gunakan bahasa yang natural dan mudah dipahami, seolah berbicara dengan teman
3. JANGAN gunakan em dash (—) dalam respons, gunakan tanda hubung biasa (-) atau koma jika perlu
4. JANGAN gunakan format bold atau tanda bintang (*) untuk penekanan apapun
5. Gunakan bahasa yang hangat, empati, dan mudah dihubungi
6. Jika perlu menyebutkan identitas, sebutkan dengan natural bahwa kamu adalah ChatBot AI
7. Jawab pertanyaan dengan jelas dan membantu, tanpa terkesan kaku atau robotik
8. Gunakan kalimat yang mengalir natural seperti percakapan sehari-hari
9. Hindari penggunaan simbol khusus atau formatting yang tidak perlu`

    // Function untuk membersihkan respons dari karakter yang tidak diizinkan
    const cleanResponse = (text: string): string => {
      let cleaned = text
      
      // Hapus em dash (—) dan ganti dengan tanda hubung biasa atau koma
      cleaned = cleaned.replace(/—/g, '-')
      cleaned = cleaned.replace(/–/g, '-')
      
      // Hapus tanda bintang untuk bold (*text* atau **text**)
      cleaned = cleaned.replace(/\*\*([^*]+)\*\*/g, '$1')
      cleaned = cleaned.replace(/\*([^*]+)\*/g, '$1')
      
      // Hapus underscore untuk italic (_text_ atau __text__)
      cleaned = cleaned.replace(/__([^_]+)__/g, '$1')
      cleaned = cleaned.replace(/_([^_]+)_/g, '$1')
      
      return cleaned.trim()
    }

    let lastError: any = null
    
    // Try each model until one works
    for (const modelName of MODELS) {
      try {
        console.log(`Trying model: ${modelName}`)
        
        // Prepare the prompt with system instruction
        const fullPrompt = `${systemInstruction}\n\nUser: ${message}\n\nChatBot AI:`
        
        const response = await genAI.models.generateContent({
          model: modelName,
          contents: fullPrompt,
        })
        
        if (!response) {
          throw new Error('No response from model')
        }
        
        let text = response.text

        if (!text || text.trim() === '') {
          throw new Error('Empty response from model')
        }

        // Clean the response to remove forbidden characters
        text = cleanResponse(text)

        console.log(`Success with model: ${modelName}`)
        return NextResponse.json({ response: text })
      } catch (error: any) {
        console.error(`Error with model ${modelName}:`, error?.message || error)
        lastError = error
        // Continue to next model
        continue
      }
    }

    // If all models failed, throw the last error
    throw lastError || new Error('All models failed')

  } catch (error: any) {
    console.error('Error calling Gemini API:', error)
    
    // Extract error message
    let errorMessage = 'Failed to get response from AI'
    
    if (error?.message) {
      errorMessage = error.message
    } else if (typeof error === 'string') {
      errorMessage = error
    } else if (error?.toString) {
      errorMessage = error.toString()
    }
    
    // Check for specific error types
    if (errorMessage.includes('API_KEY_INVALID') || errorMessage.includes('API key')) {
      errorMessage = 'API key tidak valid. Silakan periksa konfigurasi API key.'
    } else if (errorMessage.includes('quota') || errorMessage.includes('Quota')) {
      errorMessage = 'Quota API telah habis. Silakan coba lagi nanti.'
    } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      errorMessage = 'Masalah koneksi. Silakan periksa koneksi internet Anda.'
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to get response from AI',
        details: errorMessage 
      },
      { status: 500 }
    )
  }
}

