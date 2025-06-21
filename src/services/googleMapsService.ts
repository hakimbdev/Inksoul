import { GOOGLE_APIS_CONFIG } from '../config/googleApis';

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface NearbyPlace {
  place_id: string;
  name: string;
  vicinity: string;
  types: string[];
  geometry: {
    location: Location;
  };
  rating?: number;
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
}

class GoogleMapsService {
  private map: google.maps.Map | null = null;
  private isLoaded = false;

  async loadGoogleMaps(): Promise<boolean> {
    if (this.isLoaded) return true;

    try {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `${GOOGLE_APIS_CONFIG.MAPS_API_URL}?key=${GOOGLE_APIS_CONFIG.MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          this.isLoaded = true;
          resolve(true);
        };
        
        script.onerror = () => {
          reject(new Error('Failed to load Google Maps'));
        };
        
        document.head.appendChild(script);
      });
    } catch (error) {
      console.error('Error loading Google Maps:', error);
      return false;
    }
  }

  async getCurrentLocation(): Promise<Location | null> {
    try {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation not supported'));
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            reject(error);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000,
          }
        );
      });
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  }

  async findNearbyArtGalleries(location: Location, radius = 5000): Promise<NearbyPlace[]> {
    try {
      if (!this.isLoaded) {
        await this.loadGoogleMaps();
      }

      const service = new google.maps.places.PlacesService(
        document.createElement('div')
      );

      return new Promise((resolve, reject) => {
        const request = {
          location: new google.maps.LatLng(location.lat, location.lng),
          radius,
          type: 'art_gallery',
        };

        service.nearbySearch(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            resolve(results as NearbyPlace[]);
          } else {
            reject(new Error('Places search failed'));
          }
        });
      });
    } catch (error) {
      console.error('Error finding nearby galleries:', error);
      return [];
    }
  }

  async geocodeAddress(address: string): Promise<Location | null> {
    try {
      if (!this.isLoaded) {
        await this.loadGoogleMaps();
      }

      const geocoder = new google.maps.Geocoder();

      return new Promise((resolve, reject) => {
        geocoder.geocode({ address }, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
            const location = results[0].geometry.location;
            resolve({
              lat: location.lat(),
              lng: location.lng(),
              address: results[0].formatted_address,
            });
          } else {
            reject(new Error('Geocoding failed'));
          }
        });
      });
    } catch (error) {
      console.error('Error geocoding address:', error);
      return null;
    }
  }

  async initializeMap(container: HTMLElement, center: Location): Promise<google.maps.Map | null> {
    try {
      if (!this.isLoaded) {
        await this.loadGoogleMaps();
      }

      this.map = new google.maps.Map(container, {
        center: { lat: center.lat, lng: center.lng },
        zoom: 15,
        styles: [
          {
            featureType: 'poi.business',
            elementType: 'labels',
            stylers: [{ visibility: 'on' }],
          },
        ],
      });

      return this.map;
    } catch (error) {
      console.error('Error initializing map:', error);
      return null;
    }
  }
}

export const googleMapsService = new GoogleMapsService();