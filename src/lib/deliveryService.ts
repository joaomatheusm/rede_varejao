import * as Location from 'expo-location';
import { DELIVERY_CONFIG } from '../config/delivery';

export interface DeliveryCheck {
  available: boolean;
  distance?: number;
  message: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

class DeliveryService {
  private storeLocation: Coordinates = DELIVERY_CONFIG.storeLocation;
  private maxDeliveryRadius = DELIVERY_CONFIG.maxDeliveryRadius;

  setStoreLocation(coordinates: Coordinates) {
    this.storeLocation = coordinates;
  }

  
   //Define o raio máximo de entrega
   
  setMaxDeliveryRadius(radius: number) {
    this.maxDeliveryRadius = radius;
  }

  
   //Verifica se a entrega está disponível para um endereço
   
  async checkDeliveryAvailability(address: string): Promise<DeliveryCheck> {
    try {
      // 1. Obter coordenadas do endereço
      const clientCoords = await this.getCoordinatesFromAddress(address);
      
      if (!clientCoords) {
        return {
          available: false,
          message: DELIVERY_CONFIG.messages.addressNotFound
        };
      }

      // 2. Calcular distância
      const distance = this.calculateDistance(this.storeLocation, clientCoords);

      // 3. Verificar se está dentro do raio
      if (distance <= this.maxDeliveryRadius) {
        return {
          available: true,
          distance: Number(distance.toFixed(2)),
          message: `${DELIVERY_CONFIG.messages.deliveryAvailable} Distância: ${distance.toFixed(1)}km`
        };
      } else {
        return {
          available: false,
          distance: Number(distance.toFixed(2)),
          message: `${DELIVERY_CONFIG.messages.deliveryUnavailable}\nDistância: ${distance.toFixed(1)}km (máximo: ${this.maxDeliveryRadius}km)`
        };
      }
    } catch (error) {
      console.error('Erro ao verificar disponibilidade de entrega:', error);
      return {
        available: false,
        message: DELIVERY_CONFIG.messages.errorChecking
      };
    }
  }

  
   //Obter coordenadas de um endereço usando geocoding
  
  private async getCoordinatesFromAddress(address: string): Promise<Coordinates | null> {
    try {
      // Solicitar permissão se necessário
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permissão de localização negada');
      }

      // Fazer geocoding do endereço
      const geocoded = await Location.geocodeAsync(address);
      
      if (geocoded.length > 0) {
        return {
          latitude: geocoded[0].latitude,
          longitude: geocoded[0].longitude
        };
      }
      
      return null;
    } catch (error) {
      console.error('Erro no geocoding:', error);
      return null;
    }
  }

  
   //Calcular distância entre duas coordenadas usando a fórmula de Haversine
   
  private calculateDistance(point1: Coordinates, point2: Coordinates): number {
    const R = 6371; // raio da terra em km
    const dLat = this.toRad(point2.latitude - point1.latitude);
    const dLng = this.toRad(point2.longitude - point1.longitude);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRad(point1.latitude)) * Math.cos(this.toRad(point2.latitude)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // distancia em km
  }

  
   //Converter graus para radianos
   
  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

   
  async checkDeliveryByCoordinates(coordinates: Coordinates): Promise<DeliveryCheck> {
    try {
      const distance = this.calculateDistance(this.storeLocation, coordinates);

      if (distance <= this.maxDeliveryRadius) {
        return {
          available: true,
          distance: Number(distance.toFixed(2)),
          message: `${DELIVERY_CONFIG.messages.deliveryAvailable} Distância: ${distance.toFixed(1)}km`
        };
      } else {
        return {
          available: false,
          distance: Number(distance.toFixed(2)),
          message: `${DELIVERY_CONFIG.messages.deliveryUnavailable}\nDistância: ${distance.toFixed(1)}km (máximo: ${this.maxDeliveryRadius}km)`
        };
      }
    } catch (error) {
      console.error('Erro ao verificar entrega por coordenadas:', error);
      return {
        available: false,
        message: "Erro ao verificar a disponibilidade de entrega."
      };
    }
  }

  
  getDeliveryInfo() {
    return {
      storeLocation: this.storeLocation,
      maxRadius: this.maxDeliveryRadius,
      radiusText: `${this.maxDeliveryRadius}km`
    };
  }
}

export const deliveryService = new DeliveryService();