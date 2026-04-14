export interface Patient {
  id: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export interface Evolution {
  id: string;
  patientId: string;
  date: string;
  content: string; // Raw notes
  formattedContent: string; // TCC formatted
  type: 'raw' | 'tcc';
  createdAt: string;
}

export interface Transaction {
  id: string;
  patientId: string;
  amount: number;
  date: string;
  status: 'pending' | 'paid';
  description: string;
  createdAt: string;
}
