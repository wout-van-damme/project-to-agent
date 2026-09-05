

export interface AgentConfig {
    id: number;
    name: string;
    provider: string;
    modelName: string;
    url: string;
    apiKey: string;
    gitRepository?: string;
}