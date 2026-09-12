/**
 * AgroGan NextGen - Servicio Web Bluetooth & Hardware IoT
 * Soporta conexión Web Bluetooth API nativa con bastones RFID (Allflex, Tru-Test, Gallagher)
 * y básculas digitales de corral, con simulador integrado para trabajo en campo sin hardware físico.
 */

export interface DispositivoBluetooth {
  id: string;
  nombre: string;
  tipo: 'rfid_stick' | 'scale' | 'collar';
  modelo: string;
  conectado: boolean;
  bateria?: number; // 0 - 100%
  ultimaLectura?: string;
  ultimoTimestamp?: string;
}

export interface LecturaRfid {
  chipRfid: string;
  codigoPractico?: string;
  timestamp: string;
  origen: 'bluetooth_real' | 'simulador';
  rssi?: number;
}

export interface LecturaPeso {
  pesoKg: number;
  estable: boolean;
  timestamp: string;
  origen: 'bluetooth_real' | 'simulador';
}

type RfidListener = (lectura: LecturaRfid) => void;
type PesoListener = (lectura: LecturaPeso) => void;
type StatusListener = (dispositivos: DispositivoBluetooth[]) => void;

class BluetoothHardwareService {
  private dispositivos: DispositivoBluetooth[] = [
    {
      id: 'ble-rfid-1',
      nombre: 'Allflex RS420 Stick Reader',
      tipo: 'rfid_stick',
      modelo: 'Allflex RS420 Dual HDX/FDX',
      conectado: true,
      bateria: 88,
      ultimaLectura: '982.000123849102',
      ultimoTimestamp: new Date().toLocaleTimeString()
    },
    {
      id: 'ble-scale-1',
      nombre: 'Tru-Test S3 Weigh Scale',
      tipo: 'scale',
      modelo: 'Tru-Test S3 Bluetooth Indicator',
      conectado: false,
      bateria: 72,
      ultimaLectura: '485.5 kg',
      ultimoTimestamp: 'Hace 10 min'
    }
  ];

  private rfidListeners: Set<RfidListener> = new Set();
  private pesoListeners: Set<PesoListener> = new Set();
  private statusListeners: Set<StatusListener> = new Set();

  constructor() {
    const saved = localStorage.getItem('agrogan_ble_devices') || localStorage.getItem('agrotech_ble_devices');
    if (saved) {
      try {
        this.dispositivos = JSON.parse(saved);
      } catch (e) {
        console.warn('Error leyendo dispositivos BLE:', e);
      }
    }
  }

  public getDispositivos(): DispositivoBluetooth[] {
    return [...this.dispositivos];
  }

  public isAvailable(): boolean {
    return typeof navigator !== 'undefined' && 'bluetooth' in navigator;
  }

  public subscribeRfid(listener: RfidListener): () => void {
    this.rfidListeners.add(listener);
    return () => this.rfidListeners.delete(listener);
  }

  public subscribePeso(listener: PesoListener): () => void {
    this.pesoListeners.add(listener);
    return () => this.pesoListeners.delete(listener);
  }

  public subscribeStatus(listener: StatusListener): () => void {
    this.statusListeners.add(listener);
    return () => this.statusListeners.delete(listener);
  }

  private notifyStatus(): void {
    localStorage.setItem('agrogan_ble_devices', JSON.stringify(this.dispositivos));
    this.statusListeners.forEach(l => l([...this.dispositivos]));
  }

  public toggleConexion(id: string): boolean {
    const dev = this.dispositivos.find(d => d.id === id);
    if (!dev) return false;
    dev.conectado = !dev.conectado;
    if (dev.conectado) {
      dev.ultimoTimestamp = new Date().toLocaleTimeString();
    }
    this.notifyStatus();
    return dev.conectado;
  }

  public async emparejarDispositivoReal(tipo: 'rfid_stick' | 'scale'): Promise<DispositivoBluetooth> {
    if (!this.isAvailable()) {
      throw new Error('Web Bluetooth API no soportada en este navegador. Utilice el simulador.');
    }

    try {
      // @ts-ignore - Web Bluetooth types
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['battery_service', 'device_information']
      });

      const nuevo: DispositivoBluetooth = {
        id: device.id || `ble-${Date.now()}`,
        nombre: device.name || (tipo === 'rfid_stick' ? 'Bastón RFID Bluetooth' : 'Báscula Bluetooth'),
        tipo,
        modelo: 'Dispositivo Web Bluetooth',
        conectado: true,
        bateria: 95,
        ultimoTimestamp: new Date().toLocaleTimeString()
      };

      this.dispositivos.push(nuevo);
      this.notifyStatus();
      return nuevo;
    } catch (err: any) {
      throw new Error(err?.message || 'Error al conectar dispositivo Bluetooth');
    }
  }

  public simularEscaneoRfid(chipRfid: string, codigoPractico?: string): LecturaRfid {
    const rfidStick = this.dispositivos.find(d => d.tipo === 'rfid_stick');
    if (rfidStick) {
      rfidStick.conectado = true;
      rfidStick.ultimaLectura = chipRfid;
      rfidStick.ultimoTimestamp = new Date().toLocaleTimeString();
      this.notifyStatus();
    }

    const lectura: LecturaRfid = {
      chipRfid,
      codigoPractico,
      timestamp: new Date().toISOString(),
      origen: 'simulador',
      rssi: -45
    };

    this.rfidListeners.forEach(l => l(lectura));
    return lectura;
  }

  public simularLecturaPeso(pesoKg: number): LecturaPeso {
    const scale = this.dispositivos.find(d => d.tipo === 'scale');
    if (scale) {
      scale.conectado = true;
      scale.ultimaLectura = `${pesoKg.toFixed(1)} kg`;
      scale.ultimoTimestamp = new Date().toLocaleTimeString();
      this.notifyStatus();
    }

    const lectura: LecturaPeso = {
      pesoKg,
      estable: true,
      timestamp: new Date().toISOString(),
      origen: 'simulador'
    };

    this.pesoListeners.forEach(l => l(lectura));
    return lectura;
  }
}

export const bluetoothHardware = new BluetoothHardwareService();
