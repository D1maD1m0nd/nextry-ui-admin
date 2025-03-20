export interface GenerationConfigDetail {
  id: string;
  configName: string;
  config: Record<string, {
    inputs: Record<string, any>;
    class_type: string;
    _meta: {
      title: string;
    };
  }>;
} 