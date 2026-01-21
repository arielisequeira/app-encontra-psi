// Configuração do Mercado Pago
import { MercadoPagoConfig, Preference } from 'mercadopago';

// Inicializar cliente do Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.NEXT_PUBLIC_MERCADOPAGO_ACCESS_TOKEN || '',
});

export const preference = new Preference(client);

// Criar preferência de pagamento para assinatura
export async function createSubscriptionPreference(psychologistData: {
  fullName: string;
  email: string;
  crp: string;
}) {
  try {
    const preferenceData = {
      items: [
        {
          id: '4432970547', // ID do produto no Mercado Pago
          title: 'Assinatura Mensal EncontraPsi - Psicólogo',
          description: 'Plano mensal para divulgação profissional e gestão de agendamentos',
          quantity: 1,
          unit_price: 49.90,
          currency_id: 'BRL',
        },
      ],
      payer: {
        name: psychologistData.fullName,
        email: psychologistData.email,
      },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
        failure: `${process.env.NEXT_PUBLIC_APP_URL}/payment/failure`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL}/payment/pending`,
      },
      auto_return: 'approved' as const,
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/mercadopago/webhook`,
      metadata: {
        psychologist_crp: psychologistData.crp,
        psychologist_email: psychologistData.email,
        subscription_type: 'monthly',
      },
    };

    const response = await preference.create({ body: preferenceData });
    return response;
  } catch (error) {
    console.error('Erro ao criar preferência de pagamento:', error);
    throw error;
  }
}
