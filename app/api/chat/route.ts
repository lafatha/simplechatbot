import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

const API_KEY = 'AIzaSyDkfjfY88VKk9dzm439Q8W-evP7qqOw87U'

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
      return NextResponse.json(
        { error: 'API key is not configured' },
        { status: 500 }
      )
    }

    const genAI = new GoogleGenAI({ apiKey: API_KEY })
    
    let lastError: any = null
    
    // Try each model until one works
    for (const modelName of MODELS) {
      try {
        console.log(`Trying model: ${modelName}`)
        
        const response = await genAI.models.generateContent({
          model: modelName,
          contents: message,
        })
        
        if (!response) {
          throw new Error('No response from model')
        }
        
        const text = response.text

        if (!text || text.trim() === '') {
          throw new Error('Empty response from model')
        }

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

