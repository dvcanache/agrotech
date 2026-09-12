import React, { useState, useEffect } from 'react';
import {
  X,
  Bluetooth,
  Wifi,
  WifiOff,
  RefreshCw,
  Cpu,
  Radio,
  Scale,
  CheckCircle2,
  AlertCircle,
  BatteryCharging,
  Tag,
  Clock,
  Send
} from 'lucide-react';
import { bluetoothHardware, DispositivoBluetooth } from '../../services/bluetoothHardware';
import { offlineSyncService, OutboxItem } from '../../services/offlineSyncService';

interface HardwareSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HardwareSyncModal: React.FC<HardwareSyncModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'bluetooth' | 'outbox'>('bluetooth');
  const [dispositivos, setDispositivos] = useState<DispositivoBluetooth[]>(bluetoothHardware.getDispositivos());
  const [outboxItems, setOutboxItems] = useState<OutboxItem[]>(offlineSyncService.getQueue());
  const [isOnline, setIsOnline] = useState<boolean>(offlineSyncService.isOnline());
  const [simRfidTag, setSimRfidTag] = useState<string>('0001');
  const [simWeight, setSimWeight] = useState<number>(485.5);
  const [lastNotification, setLastNotification] = useState<string | null>(null);

  useEffect(() => {
    const unsubBle = bluetoothHardware.subscribeStatus(setDispositivos);
    const unsubSync = offlineSyncService.subscribe((items, online) => {
      setOutboxItems(items);
      setIsOnline(online);
    });

    return () => {
      unsubBle();
      unsubSync();
    };
  }, []);

  if (!isOpen) return null;

  const handleSimulateRfid = () => {
    const fakeChip = `982.000123${simRfidTag.padStart(6, '0')}`;
    bluetoothHardware.simularEscaneoRfid(fakeChip, simRfidTag);
    setLastNotification(`¡Arete RFID escaneado por Bluetooth! Chip: ${fakeChip} (Animal: ${simRfidTag})`);
    setTimeout(() => setLastNotification(null), 4000);
  };

  const handleSimulateWeight = () => {
    bluetoothHardware.simularLecturaPeso(simWeight);
    setLastNotification(`¡Lectura de Báscula recibida por Bluetooth!: ${simWeight.toFixed(1)} kg`);
    setTimeout(() => setLastNotification(null), 4000);
  };

  const handleToggleOffline = () => {
    const nuevo = offlineSyncService.toggleModoOfflineSimulado();
    setLastNotification(nuevo ? 'Conexión restaurada. Sincronizando cola...' : 'Modo fuera de línea activado (Sin red celular)');
    setTimeout(() => setLastNotification(null), 3000);
  };

  const handleProcessSync = async () => {
    const res = await offlineSyncService.procesarCola();
    setLastNotification(`Sincronización completada: ${res.exitosos} eventos guardados en la nube.`);
    setTimeout(() => setLastNotification(null), 3000);
  };

  return (
    <div className="report-modal-overlay" style={{ zIndex: 10000 }}>
      <div className="report-modal-content" style={{ maxWidth: 640, width: '92%', borderRadius: 16 }}>
        {/* Header */}
        <div className="report-modal-header" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-gray)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ padding: 8, borderRadius: 10, background: '#e8f5e9', color: '#2d6a4f' }}>
              <Cpu size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
                Hardware IoT de Campo & Sincronización
              </h3>
              <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)' }}>
                Bastones RFID, básculas Bluetooth y control de cola fuera de línea
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ cursor: 'pointer', padding: 6, color: 'var(--text-secondary)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Notification Toast */}
        {lastNotification && (
          <div style={{
            margin: '12px 20px 0',
            padding: '8px 14px',
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: 8,
            fontSize: 12,
            color: '#065f46',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <CheckCircle2 size={16} color="#059669" />
            {lastNotification}
          </div>
        )}

        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: 8, padding: '12px 20px 0', borderBottom: '1px solid var(--border-gray)' }}>
          <button
            onClick={() => setActiveTab('bluetooth')}
            style={{
              padding: '8px 16px',
              fontSize: 13,
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              borderBottom: activeTab === 'bluetooth' ? '2px solid #2d6a4f' : '2px solid transparent',
              color: activeTab === 'bluetooth' ? '#2d6a4f' : 'var(--text-secondary)'
            }}
          >
            <Bluetooth size={16} /> Dispositivos Bluetooth ({dispositivos.filter(d => d.conectado).length})
          </button>
          <button
            onClick={() => setActiveTab('outbox')}
            style={{
              padding: '8px 16px',
              fontSize: 13,
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              borderBottom: activeTab === 'outbox' ? '2px solid #2d6a4f' : '2px solid transparent',
              color: activeTab === 'outbox' ? '#2d6a4f' : 'var(--text-secondary)'
            }}
          >
            {isOnline ? <Wifi size={16} color="#16a34a" /> : <WifiOff size={16} color="#dc2626" />}
            Cola Offline ({outboxItems.length})
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '16px 20px', maxHeight: '65vh', overflowY: 'auto' }}>
          {activeTab === 'bluetooth' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Device cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {dispositivos.map(dev => (
                  <div
                    key={dev.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 12,
                      background: dev.conectado ? '#f0fdf4' : '#f8fafc',
                      border: `1px solid ${dev.conectado ? '#bbf7d0' : '#e2e8f0'}`,
                      borderRadius: 12
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 38,
                        height: 38,
                        borderRadius: 10,
                        background: dev.conectado ? '#dcfce7' : '#e2e8f0',
                        color: dev.conectado ? '#15803d' : '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {dev.tipo === 'rfid_stick' ? <Radio size={20} /> : <Scale size={20} />}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                          {dev.nombre}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                          {dev.modelo} • Última lectura: <b>{dev.ultimaLectura || 'Ninguna'}</b> ({dev.ultimoTimestamp || 'Hoy'})
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {dev.bateria && (
                        <span style={{ fontSize: 11, color: '#15803d', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <BatteryCharging size={14} /> {dev.bateria}%
                        </span>
                      )}
                      <button
                        onClick={() => bluetoothHardware.toggleConexion(dev.id)}
                        style={{
                          padding: '5px 12px',
                          borderRadius: 20,
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: 'pointer',
                          background: dev.conectado ? '#dcfce7' : '#e2e8f0',
                          color: dev.conectado ? '#166534' : '#475569',
                          border: 'none'
                        }}
                      >
                        {dev.conectado ? 'Conectado' : 'Desconectado'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Hardware Simulator Controls */}
              <div style={{ padding: 14, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Tag size={15} /> Simulador de Manga y Corrales de Manejo
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 11, color: '#64748b' }}>Simular Escaneo Arete (Bastón RFID):</label>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <select
                        value={simRfidTag}
                        onChange={e => setSimRfidTag(e.target.value)}
                        style={{ flex: 1, padding: '6px 8px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12 }}
                      >
                        <option value="0001">0001 - Vaca MARIPOSA</option>
                        <option value="0002">0002 - Vaca BONITA</option>
                        <option value="BCA01">BCA01 - Becerra</option>
                        <option value="CW012">CW012 - Vientre</option>
                      </select>
                      <button
                        onClick={handleSimulateRfid}
                        style={{
                          padding: '6px 12px',
                          background: '#2d6a4f',
                          color: '#fff',
                          borderRadius: 8,
                          fontSize: 12,
                          fontWeight: 500,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4
                        }}
                      >
                        <Radio size={14} /> Escanear
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 11, color: '#64748b' }}>Simular Báscula Digital (kg):</label>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <input
                        type="number"
                        value={simWeight}
                        onChange={e => setSimWeight(parseFloat(e.target.value) || 0)}
                        style={{ flex: 1, padding: '6px 8px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12 }}
                      />
                      <button
                        onClick={handleSimulateWeight}
                        style={{
                          padding: '6px 12px',
                          background: '#0284c7',
                          color: '#fff',
                          borderRadius: 8,
                          fontSize: 12,
                          fontWeight: 500,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4
                        }}
                      >
                        <Scale size={14} /> Pesar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Online/Offline status card */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 12,
                borderRadius: 12,
                background: isOnline ? '#f0fdf4' : '#fef2f2',
                border: `1px solid ${isOnline ? '#bbf7d0' : '#fecaca'}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {isOnline ? <Wifi size={20} color="#16a34a" /> : <WifiOff size={20} color="#dc2626" />}
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: isOnline ? '#166534' : '#991b1b' }}>
                      {isOnline ? 'Conexión a Internet Estable' : 'Modo Fuera de Línea (Offline Activo)'}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                      {isOnline ? 'Las transacciones se sincronizan automáticamente con la nube.' : 'Los eventos se guardan en la memoria local del dispositivo.'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleToggleOffline}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 8,
                    fontSize: 11,
                    fontWeight: 600,
                    border: '1px solid #cbd5e1',
                    background: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  {isOnline ? 'Simular Sin Señal' : 'Reconectar Señal'}
                </button>
              </div>

              {/* Queue list */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
                    Eventos en Cola Diferida ({outboxItems.length}):
                  </span>
                  <button
                    onClick={handleProcessSync}
                    disabled={!isOnline || outboxItems.length === 0}
                    style={{
                      padding: '4px 10px',
                      background: isOnline && outboxItems.length > 0 ? '#2d6a4f' : '#cbd5e1',
                      color: '#fff',
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      cursor: isOnline && outboxItems.length > 0 ? 'pointer' : 'default'
                    }}
                  >
                    <RefreshCw size={12} /> Sincronizar Ahora
                  </button>
                </div>

                {outboxItems.length === 0 ? (
                  <div style={{ padding: 20, textAlign: 'center', color: '#94a3b8', fontSize: 12, border: '1px dashed #cbd5e1', borderRadius: 10 }}>
                    La cola está limpia. No hay transacciones pendientes de sincronizar.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {outboxItems.map(item => (
                      <div
                        key={item.id}
                        style={{
                          padding: '8px 12px',
                          background: '#fff',
                          border: '1px solid var(--border-gray)',
                          borderRadius: 8,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: 12
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{
                            padding: '2px 6px',
                            borderRadius: 4,
                            fontSize: 10,
                            fontWeight: 600,
                            background: '#e0f2fe',
                            color: '#0369a1',
                            textTransform: 'uppercase'
                          }}>
                            {item.entidad}
                          </span>
                          <span style={{ color: 'var(--text-primary)' }}>
                            {item.accion.toUpperCase()}: {JSON.stringify(item.datos).slice(0, 35)}...
                          </span>
                        </div>
                        <span style={{ fontSize: 11, color: '#64748b' }}>
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border-gray)', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 18px',
              background: '#2d6a4f',
              color: '#fff',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            Aceptar y Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
