'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth';
import PaymentGateway from '@/components/PaymentGateway';

export default function PagoPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const handlePaymentComplete = (method: string) => {
    console.log('Pago completado con método:', method);
    // Aquí se podría guardar la orden en el backend
  };

  const handleCancel = () => {
    router.push('/carrito');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-pink-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Completar Pago</h1>
          <p className="text-gray-600">Selecciona tu método de pago preferido</p>
        </div>

        <PaymentGateway
          onPaymentComplete={handlePaymentComplete}
          onCancel={handleCancel}
        />
      </div>
    </main>
  );
}
