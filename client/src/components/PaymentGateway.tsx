'use client';

import { useState } from 'react';
import { AlertCircle, CheckCircle, Copy, Smartphone, QrCode, CreditCard } from 'lucide-react';
import { useCartStore } from '@/lib/store';

type PaymentMethodType = 'yape' | 'qr' | 'tarjeta' | null;

interface PaymentGatewayProps {
  onPaymentComplete?: (method: string) => void;
  onCancel?: () => void;
}

export default function PaymentGateway({ onPaymentComplete, onCancel }: PaymentGatewayProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const { getTotalPrice, items } = useCartStore();

  const totalAmount = getTotalPrice();

  // Datos de cuenta bancaria simulados
  const bankDetails = {
    accountNumber: '19021234567890',
    accountType: 'Cuenta Corriente',
    bankName: 'Banco del Ejemplo',
    currency: 'PEN',
    reference: `GUOR${Date.now()}`,
  };

  const handleCopyReference = () => {
    navigator.clipboard.writeText(bankDetails.reference);
    setCopiedToClipboard(true);
    setTimeout(() => setCopiedToClipboard(false), 2000);
  };

  const handlePaymentComplete = () => {
    if (selectedMethod && onPaymentComplete) {
      onPaymentComplete(selectedMethod);
    }
    setShowConfirmation(true);
  };

  if (showConfirmation && selectedMethod) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto text-center">
        <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Pago Iniciado!</h2>
        <p className="text-gray-600 mb-4">
          Tu pedido ha sido registrado. Por favor, completa el pago siguiendo las instrucciones.
        </p>
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <p className="text-sm text-gray-600">Monto a pagar</p>
          <p className="text-2xl font-bold text-amber-700">S/. {totalAmount.toFixed(2)}</p>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          {selectedMethod === 'yape' && 'Abre tu app de Yape y escanea el código QR'}
          {selectedMethod === 'qr' && 'Transfiere a la cuenta bancaria usando el código QR o los datos'}
          {selectedMethod === 'tarjeta' && 'Se procesará tu pago con tarjeta débito'}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setShowConfirmation(false);
              setSelectedMethod(null);
            }}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Volver
          </button>
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition"
          >
            Finalizar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
      {/* Resumen del pedido */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Resumen de Pedido</h2>
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="flex justify-between mb-3">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-semibold">S/. {(totalAmount / 1.08).toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-3 border-b pb-3">
            <span className="text-gray-600">IGV (8%):</span>
            <span className="font-semibold">S/. {(totalAmount - totalAmount / 1.08).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-lg font-bold text-gray-800">Total a Pagar:</span>
            <span className="text-2xl font-bold text-amber-700">S/. {totalAmount.toFixed(2)}</span>
          </div>
        </div>
        <p className="text-sm text-gray-500">
          {items.length} artículos en tu pedido
        </p>
      </div>

      {/* Métodos de pago */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Método de Pago</h2>
      <div className="space-y-4 mb-8">
        {/* Opción Yape */}
        <button
          onClick={() => setSelectedMethod('yape')}
          className={`w-full p-4 border-2 rounded-lg transition ${
            selectedMethod === 'yape'
              ? 'border-amber-700 bg-amber-50'
              : 'border-gray-200 hover:border-amber-700'
          }`}
        >
          <div className="flex items-center gap-4">
            <Smartphone className="w-8 h-8 text-amber-700" />
            <div className="text-left flex-1">
              <h3 className="font-bold text-gray-800">Yape</h3>
              <p className="text-sm text-gray-600">Billetera digital - Pago inmediato</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 ${
              selectedMethod === 'yape' ? 'bg-amber-700 border-amber-700' : 'border-gray-300'
            }`} />
          </div>
        </button>

        {/* Opción QR / Transferencia */}
        <button
          onClick={() => setSelectedMethod('qr')}
          className={`w-full p-4 border-2 rounded-lg transition ${
            selectedMethod === 'qr'
              ? 'border-amber-700 bg-amber-50'
              : 'border-gray-200 hover:border-amber-700'
          }`}
        >
          <div className="flex items-center gap-4">
            <QrCode className="w-8 h-8 text-amber-700" />
            <div className="text-left flex-1">
              <h3 className="font-bold text-gray-800">Transferencia Bancaria</h3>
              <p className="text-sm text-gray-600">QR o código de referencia</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 ${
              selectedMethod === 'qr' ? 'bg-amber-700 border-amber-700' : 'border-gray-300'
            }`} />
          </div>
        </button>

        {/* Opción Tarjeta */}
        <button
          onClick={() => setSelectedMethod('tarjeta')}
          className={`w-full p-4 border-2 rounded-lg transition ${
            selectedMethod === 'tarjeta'
              ? 'border-amber-700 bg-amber-50'
              : 'border-gray-200 hover:border-amber-700'
          }`}
        >
          <div className="flex items-center gap-4">
            <CreditCard className="w-8 h-8 text-amber-700" />
            <div className="text-left flex-1">
              <h3 className="font-bold text-gray-800">Tarjeta de Débito</h3>
              <p className="text-sm text-gray-600">Débito inmediato en tu cuenta</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 ${
              selectedMethod === 'tarjeta' ? 'bg-amber-700 border-amber-700' : 'border-gray-300'
            }`} />
          </div>
        </button>
      </div>

      {/* Detalles según método seleccionado */}
      {selectedMethod === 'yape' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex gap-3 mb-4">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-blue-900 mb-2">Escanea el código QR de Yape</h3>
              <p className="text-blue-800 text-sm">
                Abre tu aplicación de Yape y selecciona "Recibir dinero" o escanea este código QR:
              </p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg flex justify-center mb-4">
            <div className="w-40 h-40 bg-gray-200 rounded-lg flex items-center justify-center">
              <QrCode className="w-20 h-20 text-gray-400" />
            </div>
          </div>
          <p className="text-sm text-gray-600 text-center">
            Código Yape: <span className="font-mono font-bold">+51987654321</span>
          </p>
        </div>
      )}

      {selectedMethod === 'qr' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <h3 className="font-bold text-green-900 mb-4">Datos Bancarios</h3>
          <div className="space-y-3 mb-6">
            <div>
              <p className="text-sm text-gray-600">Banco:</p>
              <p className="font-semibold text-gray-800">{bankDetails.bankName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Número de Cuenta:</p>
              <p className="font-mono font-semibold text-gray-800">{bankDetails.accountNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tipo de Cuenta:</p>
              <p className="font-semibold text-gray-800">{bankDetails.accountType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Moneda:</p>
              <p className="font-semibold text-gray-800">{bankDetails.currency}</p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-300">
              <p className="text-sm text-gray-600 mb-2">Código de Referencia:</p>
              <div className="flex items-center justify-between">
                <p className="font-mono font-bold text-gray-800">{bankDetails.reference}</p>
                <button
                  onClick={handleCopyReference}
                  className="flex items-center gap-2 px-3 py-1 bg-amber-700 text-white rounded text-sm hover:bg-amber-800 transition"
                >
                  <Copy className="w-4 h-4" />
                  {copiedToClipboard ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg flex justify-center mb-4">
            <div className="w-40 h-40 bg-gray-200 rounded-lg flex items-center justify-center">
              <QrCode className="w-20 h-20 text-gray-400" />
            </div>
          </div>
          <p className="text-xs text-gray-600 text-center">
            Escanea este código con tu app bancaria
          </p>
        </div>
      )}

      {selectedMethod === 'tarjeta' && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
          <h3 className="font-bold text-purple-900 mb-4">Datos de Tarjeta de Débito</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Número de Tarjeta
              </label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-700"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Vencimiento (MM/YY)
                </label>
                <input
                  type="text"
                  placeholder="12/25"
                  maxLength={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-700"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  placeholder="123"
                  maxLength={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-700"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre del Titular
              </label>
              <input
                type="text"
                placeholder="Juan Pérez García"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-700"
              />
            </div>
          </div>
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex gap-4">
        <button
          onClick={onCancel}
          className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
        >
          Cancelar
        </button>
        <button
          onClick={handlePaymentComplete}
          disabled={!selectedMethod}
          className={`flex-1 px-6 py-3 rounded-lg font-semibold text-white transition ${
            selectedMethod
              ? 'bg-amber-700 hover:bg-amber-800 cursor-pointer'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          Procesar Pago
        </button>
      </div>

      <p className="text-xs text-gray-500 text-center mt-4">
        Tu información de pago es segura y encriptada
      </p>
    </div>
  );
}
