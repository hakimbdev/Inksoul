import { GOOGLE_APIS_CONFIG } from '../config/googleApis';

export interface VisionAnalysisResult {
  textAnnotations?: Array<{
    description: string;
    boundingPoly: {
      vertices: Array<{ x: number; y: number }>;
    };
  }>;
  objectAnnotations?: Array<{
    name: string;
    score: number;
    boundingPoly: {
      normalizedVertices: Array<{ x: number; y: number }>;
    };
  }>;
  wallSurfaces?: Array<{
    confidence: number;
    boundingBox: { x: number; y: number; width: number; height: number };
  }>;
}

class GoogleVisionService {
  async analyzeImage(imageBase64: string): Promise<VisionAnalysisResult> {
    try {
      const requestBody = {
        requests: [
          {
            image: {
              content: imageBase64.split(',')[1], // Remove data:image/jpeg;base64, prefix
            },
            features: [
              { type: 'TEXT_DETECTION', maxResults: 10 },
              { type: 'OBJECT_LOCALIZATION', maxResults: 10 },
              { type: 'SURFACE_DETECTION', maxResults: 5 },
            ],
          },
        ],
      };

      const response = await fetch(
        `${GOOGLE_APIS_CONFIG.VISION_API_URL}?key=${GOOGLE_APIS_CONFIG.CLOUD_VISION_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error('Vision API request failed');
      }

      const data = await response.json();
      const annotations = data.responses[0];

      return {
        textAnnotations: annotations.textAnnotations || [],
        objectAnnotations: annotations.localizedObjectAnnotations || [],
        wallSurfaces: this.detectWallSurfaces(annotations),
      };
    } catch (error) {
      console.error('Vision API error:', error);
      throw new Error('Failed to analyze image');
    }
  }

  private detectWallSurfaces(annotations: any): Array<{
    confidence: number;
    boundingBox: { x: number; y: number; width: number; height: number };
  }> {
    // Custom logic to detect wall surfaces from object annotations
    const wallObjects = annotations.localizedObjectAnnotations?.filter(
      (obj: any) => 
        obj.name.toLowerCase().includes('wall') ||
        obj.name.toLowerCase().includes('surface') ||
        obj.name.toLowerCase().includes('building')
    ) || [];

    return wallObjects.map((obj: any) => ({
      confidence: obj.score,
      boundingBox: {
        x: obj.boundingPoly.normalizedVertices[0].x,
        y: obj.boundingPoly.normalizedVertices[0].y,
        width: obj.boundingPoly.normalizedVertices[2].x - obj.boundingPoly.normalizedVertices[0].x,
        height: obj.boundingPoly.normalizedVertices[2].y - obj.boundingPoly.normalizedVertices[0].y,
      },
    }));
  }

  async extractTextFromImage(imageBase64: string): Promise<string[]> {
    try {
      const result = await this.analyzeImage(imageBase64);
      return result.textAnnotations?.map(annotation => annotation.description) || [];
    } catch (error) {
      console.error('Text extraction error:', error);
      return [];
    }
  }

  async detectWallsInImage(imageBase64: string): Promise<Array<{
    confidence: number;
    boundingBox: { x: number; y: number; width: number; height: number };
  }>> {
    try {
      const result = await this.analyzeImage(imageBase64);
      return result.wallSurfaces || [];
    } catch (error) {
      console.error('Wall detection error:', error);
      return [];
    }
  }
}

export const googleVisionService = new GoogleVisionService();