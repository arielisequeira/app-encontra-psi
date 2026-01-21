'use client';

import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, ArrowRight } from 'lucide-react';

export default function PaymentPendingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="p-8 text-center max-w-md">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-10 h-10 text-yellow-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Pagamento Pendente
        </h1>
        <p className="text-gray-600 mb-6">
          Seu pagamento está sendo processado. Você receberá um e-mail de confirmação em breve.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-700">
            <strong>Próximos passos:</strong><br />
            Aguarde a confirmação do pagamento. Assim que aprovado, seu perfil será ativado automaticamente.
          </p>
        </div>
        <Button
          onClick={() => router.push('/')}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
        >
          Voltar para Home
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </Card>
    </div>
  );
}
