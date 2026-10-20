export default function DocumentSignature({data}:{data:Record<string,any>}){
 const invoice=data.type==='Invoice';
 return <div className={'signatures '+(invoice?'invoice-signature':'')}><div><p>Issued by,</p><div className="signature-space"/><b>{data.issuer}</b>{data.issuerTitle&&<p>{data.issuerTitle}</p>}<p>{data.company}</p></div>{!invoice&&<div><p>Approved by,</p><div className="signature-space"/></div>}</div>;
}
