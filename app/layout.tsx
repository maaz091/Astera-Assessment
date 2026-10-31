import type {Metadata} from 'next';
import './globals.css';
import {Shell} from '../src/ui';
export const metadata:Metadata={title:'Studio · Northstar Supply',description:'A thoughtful sales analytics workspace'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body><Shell>{children}</Shell></body></html>}
