import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  AlertTriangle,
  ShieldAlert,
  Building2,
  DollarSign,
  FileCheck2,
  Printer,
  CheckCircle2,
  X,
  CreditCard,
  Lock,
  ArrowRight,
} from 'lucide-react';

const ECUADOR_BANKS = [
  'Banco Pichincha',
  'Banco Guayaquil',
  'Banco del Pacífico',
  'Produbanco - Grupo Promerica',
  'Banco Bolivariano',
  'Banco Internacional',
  'Banco de Loja',
  'Banco del Austro',
  'Banco General Rumiñahui',
  'Banco Solidario',
  'Cooperativa JEP',
  'Cooperativa Policía Nacional',
  'Cooperativa Alianza del Valle',
  'DeUna! / Red de Pagos Directos',
  'Otro Banco / Cooperativa Nacional',
];

const CANCELLATION_REASONS = [
  { id: 'project_finished', label: 'Ya completé mis objetivos de investigación / proyectos' },
  { id: 'financial', label: 'Inconformidad con los costos o recompensas económicas' },
  { id: 'privacy', label: 'Preferencia de privacidad y eliminación de datos personales (LOPDP)' },
  { id: 'technical', label: 'Dificultades técnicas o de usabilidad en la plataforma' },
  { id: 'closing_business', label: 'Cierre o reestructuración de la empresa / institución' },
  { id: 'other', label: 'Otra razón voluntaria' },
];

export const AccountCancellationModal = ({ isOpen, onClose }) => {
  const { currentUser, processAccountCancellation } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Advertencia & Fondos, 2: Datos Bancarios / Renuncia, 3: Confirmación Final, 4: Certificado Finiquito
  const [reason, setReason] = useState(CANCELLATION_REASONS[0].label);
  const [feedback, setFeedback] = useState('');
  
  // Opciones financieras
  const balance = parseFloat(currentUser?.balance) || 0;
  const hasFunds = balance > 0;
  const [settlementOption, setSettlementOption] = useState(hasFunds ? 'bank_transfer' : 'zero_balance');
  const [forfeitAgreement, setForfeitAgreement] = useState(false);

  // Datos bancarios
  const [bankName, setBankName] = useState(ECUADOR_BANKS[0]);
  const [accountType, setAccountType] = useState('Ahorros');
  const [accountNumber, setAccountNumber] = useState('');
  const [idDocument, setIdDocument] = useState(currentUser?.cedula || currentUser?.ruc || '');

  // Confirmación de seguridad estricta
  const [confirmationInput, setConfirmationInput] = useState('');
  const [legalAgreement, setLegalAgreement] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [certificateData, setCertificateData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen || !currentUser) return null;

  const isCompany = currentUser.role === 'provider';
  const confirmationTarget = 'DARSE DE BAJA';

  const handleNextFromStep1 = () => {
    if (hasFunds && settlementOption === 'forfeit' && !forfeitAgreement) {
      setErrorMessage('Debes aceptar expresamente la cláusula de renuncia al saldo remanente.');
      return;
    }
    setErrorMessage('');
    if (hasFunds && settlementOption === 'bank_transfer') {
      setStep(2); // ir a datos bancarios
    } else {
      setStep(3); // ir directo a confirmación final
    }
  };

  const handleNextFromStep2 = () => {
    if (!accountNumber.trim() || !idDocument.trim()) {
      setErrorMessage('Por favor ingresa el número de cuenta bancaria y tu número de Cédula o RUC.');
      return;
    }
    setErrorMessage('');
    setStep(3);
  };

  const handleFinalCancellation = async () => {
    if (confirmationInput.trim().toUpperCase() !== confirmationTarget) {
      setErrorMessage(`Debes escribir exactamente "${confirmationTarget}" para confirmar.`);
      return;
    }

    if (!legalAgreement) {
      setErrorMessage('Debes aceptar la declaración jurada y de finiquito legal.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      const result = await processAccountCancellation({
        reason,
        feedback,
        settlementType: hasFunds ? settlementOption : 'zero_balance',
        bankDetails: {
          bankName,
          accountType,
          accountNumber,
        },
        idDocument,
      });

      if (result.success) {
        setCertificateData(result.cancellationRecord);
        setStep(4); // Mostrar certificado oficial
      } else {
        setErrorMessage(result.message || 'Error procesando la baja.');
      }
    } catch (err) {
      setErrorMessage('Ocurrió un error inesperado al procesar la baja: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  const handleFinishAndExit = () => {
    onClose();
    navigate('/login', {
      replace: true,
      state: {
        accountCancelled: true,
        certificateCode: certificateData?.certificateCode,
        refundPending: certificateData?.settlementType === 'bank_transfer',
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#0F172A] border border-red-500/30 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header con alerta roja */}
        <div className="px-6 py-4 bg-gradient-to-r from-red-950/80 via-slate-900 to-red-950/80 border-b border-red-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                {isCompany ? 'Baja Definitiva y Finiquito Institucional' : 'Baja Definitiva y Cierre Legal de Cuenta'}
                <Badge variant="danger">De Ley & Auditoría</Badge>
              </h2>
              <p className="text-xs text-slate-400">
                {isCompany ? `Organización: ${currentUser.company || currentUser.name}` : `Usuario: ${currentUser.name}`} ({currentUser.email})
              </p>
            </div>
          </div>
          {step !== 4 && (
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Contenido según Step */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs font-semibold flex items-center gap-2.5 animate-shake">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ================= STEP 1: Advertencia de Fondos y Razones ================= */}
          {step === 1 && (
            <div className="space-y-5">
              {/* Alerta de Dinero / Fondos */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4" /> Balance Financiero Registrado
                  </span>
                  <span className={`text-base font-black ${hasFunds ? 'text-amber-300' : 'text-slate-400'}`}>
                    ${balance.toFixed(2)} USD
                  </span>
                </div>

                {hasFunds ? (
                  <div className="text-xs text-slate-300 space-y-3 pt-2 border-t border-slate-800">
                    <p className="text-amber-200/90 font-medium">
                      ⚠️ Tu cuenta dispone de fondos activos. Por normativa legal y tributaria ecuatoriana, debes definir el destino de este saldo:
                    </p>
                    <div className="space-y-2">
                      <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 cursor-pointer hover:border-primary/50 transition-colors">
                        <input
                          type="radio"
                          name="settlement"
                          value="bank_transfer"
                          checked={settlementOption === 'bank_transfer'}
                          onChange={() => setSettlementOption('bank_transfer')}
                          className="mt-0.5 text-primary focus:ring-primary"
                        />
                        <div className="text-xs">
                          <span className="font-bold text-white block">Solicitar Liquidación & Transferencia Bancaria Oficial</span>
                          <span className="text-slate-400 block mt-0.5">
                            El departamento financiero transferirá ${balance.toFixed(2)} USD a tu cuenta bancaria nacional en Ecuador (24-48h).
                          </span>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 cursor-pointer hover:border-red-500/50 transition-colors">
                        <input
                          type="radio"
                          name="settlement"
                          value="forfeit"
                          checked={settlementOption === 'forfeit'}
                          onChange={() => setSettlementOption('forfeit')}
                          className="mt-0.5 text-red-400 focus:ring-red-400"
                        />
                        <div className="text-xs">
                          <span className="font-bold text-red-300 block">Renuncia Expresa y Condonación del Saldo Remanente</span>
                          <span className="text-slate-400 block mt-0.5">
                            Declaras que desistes de cobrar los ${balance.toFixed(2)} USD y autorizas el cierre inmediato sin liquidación.
                          </span>
                        </div>
                      </label>
                    </div>

                    {settlementOption === 'forfeit' && (
                      <div className="p-3 bg-red-950/40 border border-red-800/50 rounded-xl space-y-2">
                        <label className="flex items-start gap-2.5 text-[11px] text-red-200 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={forfeitAgreement}
                            onChange={(e) => setForfeitAgreement(e.target.checked)}
                            className="mt-0.5 text-red-500 rounded focus:ring-red-500"
                          />
                          <span>
                            Acepto voluntariamente la extinción de mi saldo de ${balance.toFixed(2)} USD y declaro a Survey 593 libre de reclamos económicos futuros.
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">
                    Tu cuenta se encuentra en balance neutro ($0.00 USD). No existen valores pendientes de liquidación.
                  </p>
                )}
              </div>

              {/* Consecuencias del cierre */}
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2 text-xs">
                <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px] block">
                  Efectos Legales de la Cancelación:
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                  {isCompany ? (
                    <>
                      <li>Todas las encuestas y campañas activas de tu organización se detendrán y cerrarán de inmediato.</li>
                      <li>Se revocarán los permisos de los Dashboards analíticos y membresías institucionales.</li>
                      <li>Se emitirá un Acta de Finiquito Digital corporativa con valor probatorio para tu contabilidad.</li>
                    </>
                  ) : (
                    <>
                      <li>Se eliminará tu perfil demográfico y estado de verificación KYC.</li>
                      <li>Perderás acceso permanente a tu historial de encuestas y nivel de reputación.</li>
                      <li>Tus datos personales serán anonimizados/suprimidos conforme a la LOPDP (Ley de Protección de Datos).</li>
                    </>
                  )}
                </ul>
              </div>

              {/* Motivo de la baja */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-300">
                  Motivo de la desvinculación <span className="text-red-400">*</span>
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-red-500"
                >
                  {CANCELLATION_REASONS.map((r) => (
                    <option key={r.id} value={r.label}>
                      {r.label}
                    </option>
                  ))}
                </select>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Observaciones o comentarios de auditoría (Opcional)
                  </label>
                  <textarea
                    rows={2}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Escribe algún detalle o sugerencia para nuestro registro de control de calidad..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-red-500 placeholder-slate-600 resize-none"
                  />
                </div>
              </div>

              {/* Botones Step 1 */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <Button variant="ghost" size="sm" onClick={onClose}>
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleNextFromStep1}
                  className="bg-red-600 hover:bg-red-700 text-white border-0 font-bold"
                >
                  Continuar con la Baja <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </div>
          )}

          {/* ================= STEP 2: Datos Bancarios de Liquidación ================= */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-emerald-400 uppercase">Monto a Liquidar</div>
                  <div className="text-lg font-black text-white">${balance.toFixed(2)} USD</div>
                </div>
                <CreditCard className="w-8 h-8 text-emerald-400/80" />
              </div>

              <p className="text-xs text-slate-400">
                Ingresa los datos de tu cuenta bancaria en el sistema financiero de Ecuador. Debe estar a nombre del titular de la cuenta ({currentUser.name}).
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Entidad Financiera (Ecuador)</label>
                  <select
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                  >
                    {ECUADOR_BANKS.map((b, i) => (
                      <option key={i} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Tipo de Cuenta</label>
                    <select
                      value={accountType}
                      onChange={(e) => setAccountType(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Ahorros">Cuenta de Ahorros</option>
                      <option value="Corriente">Cuenta Corriente</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Cédula o RUC del Titular</label>
                    <input
                      type="text"
                      value={idDocument}
                      onChange={(e) => setIdDocument(e.target.value)}
                      placeholder="Ej. 1712345678 o 1790012345001"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Número de Cuenta Bancaria</label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="Ej. 2200123456"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              {/* Botones Step 2 */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
                  Atrás
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleNextFromStep2}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white border-0 font-bold"
                >
                  Registrar Datos y Continuar <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </div>
          )}

          {/* ================= STEP 3: Confirmación Final & Cláusula Legal ================= */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 space-y-3">
                <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-wider">
                  <Lock className="w-4 h-4" /> Declaración Jurada y Finiquito Digital
                </div>
                <div className="text-[11px] text-slate-300 leading-relaxed space-y-2 bg-slate-950/60 p-3 rounded-lg border border-red-900/40 max-h-32 overflow-y-auto">
                  <p>
                    <strong>CLÁUSULA DE FINIQUITO Y EXTINCIÓN DE OBLIGACIONES:</strong> Por medio del presente acto digital celebrado al tenor de la Ley de Comercio Electrónico, Firmas Electrónicas y Mensajes de Datos del Ecuador, y de la Ley Orgánica de Protección de Datos Personales (LOPDP):
                  </p>
                  <p>
                    El titular <strong>{currentUser.name}</strong> ({currentUser.email}) confirma de manera voluntaria e irrevocable la solicitud de baja de su cuenta en la plataforma <strong>Survey 593</strong>.
                  </p>
                  <p>
                    {hasFunds && settlementOption === 'bank_transfer'
                      ? `Se registra la solicitud de liquidación bancaria de $${balance.toFixed(2)} USD a la cuenta ${accountType} No. ${accountNumber} de ${bankName}, cédula/RUC ${idDocument}.`
                      : `Se deja constancia de que no existen saldos exigibles o que el titular ha renunciado expresamente a cualquier valor remanente.`}
                  </p>
                </div>

                <label className="flex items-start gap-2.5 text-xs text-red-200 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={legalAgreement}
                    onChange={(e) => setLegalAgreement(e.target.checked)}
                    className="mt-0.5 text-red-600 rounded focus:ring-red-600"
                  />
                  <span>
                    He leído y acepto los términos de finiquito y declaro bajo juramento la autenticidad de mi solicitud.
                  </span>
                </label>
              </div>

              {/* Input de Seguridad Estricta */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <label className="block text-xs font-bold text-slate-200">
                  Para confirmar la baja definitiva, escribe exactamente <span className="text-red-400 font-mono">DARSE DE BAJA</span>:
                </label>
                <input
                  type="text"
                  value={confirmationInput}
                  onChange={(e) => setConfirmationInput(e.target.value)}
                  placeholder="DARSE DE BAJA"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-red-500/40 text-red-300 text-sm font-mono tracking-wider focus:outline-none focus:border-red-500 text-center uppercase"
                />
              </div>

              {/* Botones Step 3 */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <Button variant="ghost" size="sm" onClick={() => setStep(hasFunds && settlementOption === 'bank_transfer' ? 2 : 1)}>
                  Atrás
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  disabled={confirmationInput.trim().toUpperCase() !== confirmationTarget || !legalAgreement || isProcessing}
                  onClick={handleFinalCancellation}
                  className="bg-red-600 hover:bg-red-700 text-white border-0 font-extrabold shadow-lg shadow-red-950/50 disabled:opacity-40"
                >
                  {isProcessing ? 'Procesando Finiquito...' : 'Confirmar Baja y Emitir Finiquito'}
                </Button>
              </div>
            </div>
          )}

          {/* ================= STEP 4: Acta Oficial de Finiquito y Certificado ================= */}
          {step === 4 && certificateData && (
            <div className="space-y-5 animate-fade-in print:p-0">
              <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-emerald-500/40 space-y-4 shadow-xl">
                {/* Encabezado del Certificado */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                      <FileCheck2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white uppercase tracking-wider">
                        Acta de Finiquito Digital & Baja Oficial
                      </h3>
                      <p className="text-[11px] text-slate-400">Survey 593 — República del Ecuador</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-mono">CÓDIGO ÚNICO:</span>
                    <span className="text-xs font-mono font-extrabold text-emerald-400">
                      {certificateData.certificateCode}
                    </span>
                  </div>
                </div>

                {/* Tabla de Datos de Auditoría */}
                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-400 text-[10px] block">TITULAR / ENTIDAD:</span>
                    <span className="font-bold text-white">{certificateData.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">CORREO REGISTRADO:</span>
                    <span className="font-bold text-white">{certificateData.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">ROL / TIPO DE CUENTA:</span>
                    <span className="font-bold text-white uppercase">{certificateData.role}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">FECHA Y HORA OFICIAL:</span>
                    <span className="font-bold text-white">
                      {new Date(certificateData.createdAt).toLocaleString('es-EC', { timeZone: 'America/Guayaquil' })} (UTC-5)
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">BALANCE FINAL LIQUIDADO:</span>
                    <span className="font-bold text-emerald-400 font-mono">
                      ${certificateData.finalBalance.toFixed(2)} USD
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">ESTADO DE LIQUIDACIÓN:</span>
                    <span className="font-bold text-white">
                      {certificateData.settlementType === 'bank_transfer'
                        ? 'Transferencia Bancaria en Trámite (24-48h)'
                        : certificateData.finalBalance > 0
                        ? 'Renuncia Voluntaria Aceptada'
                        : 'Balance Cero ($0.00)'}
                    </span>
                  </div>
                  {certificateData.settlementType === 'bank_transfer' && (
                    <div className="col-span-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-300">
                      <span className="text-slate-400 text-[10px] block">DESTINO BANCARIO REGISTRADO:</span>
                      <strong>{certificateData.bankName}</strong> — {certificateData.bankAccountType} No. {certificateData.bankAccountNumber} (Doc: {certificateData.idDocument})
                    </div>
                  )}
                </div>

                {/* Sello de Cumplimiento Legal */}
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-[10px] text-slate-400 leading-relaxed flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>
                    Este documento constituye constancia fehaciente de la cancelación de cuenta, cese de responsabilidades y supresión de datos conforme al Art. 34 de la Ley Orgánica de Protección de Datos Personales del Ecuador.
                  </span>
                </div>
              </div>

              {/* Botones de Acción Final */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handlePrintCertificate}
                  className="flex items-center gap-2 text-xs"
                >
                  <Printer className="w-4 h-4" /> Imprimir Comprobante Oficial
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleFinishAndExit}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                >
                  Finalizar y Salir
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
