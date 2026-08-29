export interface ToolConfig {
    id: number;
    name: string;
    category: string;
}

export interface ToolSetConfig {
    id: number;
    name: string;
    tools: ToolConfig[];
}