export interface Server {
  id: string;
  name: string;
  region: string;
  cpu_usage: number;
  memory_usage: number;
  network_io: string;
  status: 'Healthy' | 'Degraded' | 'Down';
}

export const mockInfrastructureData: Server[] = [
  { id: 'SRV-01', name: 'AppCluster-US-East', region: 'us-east-1', cpu_usage: 42, memory_usage: 65, network_io: '1.2 GB/s', status: 'Healthy' },
  { id: 'SRV-02', name: 'AppCluster-EU-West', region: 'eu-west-1', cpu_usage: 89, memory_usage: 92, network_io: '2.4 GB/s', status: 'Degraded' },
  { id: 'SRV-03', name: 'DB-Primary-US', region: 'us-east-1', cpu_usage: 15, memory_usage: 45, network_io: '0.4 GB/s', status: 'Healthy' },
  { id: 'SRV-04', name: 'DB-Replica-EU', region: 'eu-west-1', cpu_usage: 0, memory_usage: 0, network_io: '0 B/s', status: 'Down' },
  { id: 'SRV-05', name: 'WorkerNode-APAC', region: 'ap-southeast-1', cpu_usage: 65, memory_usage: 78, network_io: '1.8 GB/s', status: 'Healthy' },
  { id: 'SRV-06', name: 'TelemetryHub', region: 'global-edge', cpu_usage: 32, memory_usage: 55, network_io: '8.5 GB/s', status: 'Healthy' },
];
