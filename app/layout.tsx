import type {Metadata} from 'next';import './globals.css';
export const metadata:Metadata={title:'Fouria Agency | Finance & Operations',description:'Ruang kerja internal Fouria: keuangan, klien, produksi, dan quotation.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="id"><body>{children}</body></html>;}
