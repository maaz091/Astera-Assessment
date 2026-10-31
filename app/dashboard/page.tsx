import type { Metadata } from 'next';
import Dashboard from '../../src/dashboard';
export const metadata: Metadata = { title: 'Sales overview · Studio' };
export default function Page() { return <Dashboard/>; }
