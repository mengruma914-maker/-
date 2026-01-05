
export enum GearCategory {
  KNEE = 'Knee Pad',
  WRIST = 'Wrist Guard',
  WAIST = 'Waist Support',
  ELBOW = 'Elbow Pad',
  ANKLE = 'Ankle Support'
}

export enum DesignStyle {
  PROFESSIONAL = 'Sport Professional',
  MEDICAL = 'Medical Rehab',
  TRENDY = 'Fashion Street',
  FUTURISTIC = 'Geometric/Futuristic'
}

export enum MaterialType {
  CARBON_FIBER = 'Carbon Fiber',
  SILICONE = 'Medical Silicone',
  LEATHER = 'Premium Leather',
  ELASTIC_MESH = 'Breathable Elastic',
  HARD_SHELL = 'Polycabonate Shell'
}

export enum Scenario {
  STUDIO = 'Clean Studio',
  GYM = 'Modern Gym',
  BASKETBALL = 'Urban Basketball Court',
  CLINIC = 'Rehab Center',
  STREET = 'City Street'
}

export interface DesignState {
  category: GearCategory;
  style: DesignStyle;
  material: MaterialType;
  scenario: Scenario;
  mainColor: string;
  accentColor: string;
}

export interface GeneratedVariant {
  id: string;
  imageUrl: string;
  prompt: string;
  timestamp: number;
  config: DesignState;
}

export interface KeyPoint {
  x: number;
  y: number;
  label: string;
  type: 'joint' | 'strap' | 'pad';
}
