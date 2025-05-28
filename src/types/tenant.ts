export interface Tenant {
  id: string;
  name: string;
  theme: {
    primary: string;
    secondary: string;
    accent: string;
  };
  logo: string;
  domain: string;
} 