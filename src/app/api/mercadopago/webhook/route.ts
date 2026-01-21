import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Log do webhook para debug
    console.log('Webhook Mercado Pago recebido:', body);

    // Aqui você pode processar os diferentes tipos de notificação
    // payment, merchant_order, etc.
    const { type, data } = body;

    if (type === 'payment') {
      // Processar notificação de pagamento
      const paymentId = data.id;
      
      // Aqui você pode:
      // 1. Buscar detalhes do pagamento no Mercado Pago
      // 2. Atualizar status da assinatura no banco de dados
      // 3. Ativar perfil do psicólogo
      
      console.log('Pagamento recebido:', paymentId);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    return NextResponse.json(
      { error: 'Erro ao processar webhook' },
      { status: 500 }
    );
  }
}
