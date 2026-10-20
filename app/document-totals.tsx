import {invoiceTotals} from '../lib/invoice';
import {money} from '../lib/model';

export default function DocumentTotals({data}:{data:any}){
 const totals=invoiceTotals(data);
 if(data.type==='Invoice'&&data.showSubtotal===false)return <div className="document-total amount-only"><strong>{money(totals.gross)}</strong></div>;
 if(!totals.grossUp)return <div className="document-total"><span>TOTAL</span><strong>{money(totals.gross)}</strong></div>;
 return <div className="tax-breakdown">
  <div><span>Subtotal jasa</span><b>{money(totals.subtotal)}</b></div>
  <div><span>PPh 23 · ditanggung klien (gross-up)</span><b>{money(totals.allowance)}</b></div>
  <div className="document-total"><span>TOTAL TERMASUK PPh 23</span><strong>{money(totals.gross)}</strong></div>
  <p className="tax-note">PPh 23 ditanggung oleh klien dengan metode gross-up. Total = subtotal jasa ÷ 0,98. Pembulatan ke rupiah; tidak termasuk PPN.</p>
 </div>;
}
