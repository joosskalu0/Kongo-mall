import { PromoCode } from '../types';

export const PROMO_CODES: Record<string, PromoCode> = {
  ARTISAN10: {
    code: 'ARTISAN10',
    discountType: 'percentage',
    value: 10,
    description: '10% de réduction sur l’ensemble de votre commande'
  },
  BIENVENUE: {
    code: 'BIENVENUE',
    discountType: 'fixed',
    value: 15,
    minOrderValue: 60,
    description: '15$ offerts dès 60$ d’achat pour votre première création'
  },
  LIVRAISON: {
    code: 'LIVRAISON',
    discountType: 'free_shipping',
    value: 0,
    description: 'Livraison standard Colissimo offerte sans minimum'
  }
};
