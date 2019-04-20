export interface Process {
    pid: number;
    name: string;
    port: number;
    localAddress: string;
    foreignAddress: string;
    protocol: string;
    state: string;
}