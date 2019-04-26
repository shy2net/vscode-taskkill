export interface Process {
    pid: number;
    name: string;
    localAddress: string;
    foreignAddress: string;
    protocol: string;
    state: string;
}