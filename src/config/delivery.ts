export const DELIVERY_CONFIG = {
  storeLocation: {
    latitude: -22.924671101962982, 
    longitude: -43.56125845682741,
    address: "Endereço do seu estabelecimento"
  },
  
  // Raio máximo de entrega em quilômetros
  maxDeliveryRadius: 12,

  messages: {
    deliveryAvailable: "✅ Entrega disponível!",
    deliveryUnavailable: "Desculpe, não entregamos neste endereço.",
    addressNotFound: "Não foi possível localizar o endereço informado. Verifique os dados e tente novamente.",
    errorChecking: "Erro ao verificar a disponibilidade de entrega. Tente novamente."
  }
};

