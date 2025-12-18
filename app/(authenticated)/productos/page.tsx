import { redirect } from 'next/navigation';

export default function ProductosPage() {
  // Redirect to Aportes by default
  redirect('/productos/aportes');
}
