import {z} from 'zod';
const amount=z.coerce.number().int().min(0).max(1e12),str=z.string().trim().min(1).max(200), optional=z.string().max(4000).optional().default('');
const month=z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/),date=z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
export const schemas:Record<string,z.ZodTypeAny>={
 client:z.object({name:str,contact:optional,email:z.union([z.string().email(),z.literal('')]).optional().default(''),company:optional,status:z.enum(['Prospek','Aktif','Selesai','Arsip']),notes:optional}),
 period:z.object({month,budget:amount,reels:amount.max(10000),feeds:amount.max(10000),stories:amount.max(10000),productions:amount.max(1000),events:amount.max(1000),due:date,notes:optional}),
 expense:z.object({month,date,category:z.enum(['Produksi','Talent','Ongkos','Makanan','Lainnya']),detail:str,planned:amount,actual:amount,vendor:optional,notes:optional}),
 payment:z.object({month,date,amount:amount,method:str,reference:optional,notes:optional}),
 content:z.object({month,title:str,type:z.enum(['Reels','Feed','Story','Produksi','Event']),status:z.enum(['Ide','Produksi','Editing','Review','Approved','Terbit']),due:date,pic:optional,url:z.union([z.string().url().regex(/^https?:\/\//),z.literal('')]).optional().default(''),notes:optional}),
 followup:z.object({month,date,title:str,type:z.enum(['Pembayaran','Approval konten','Produksi','Lainnya']),status:z.enum(['Terjadwal','Selesai']),pic:optional,notes:optional}),
 bank:z.object({bankName:str,accountNumber:z.string().trim().regex(/^[0-9 -]{5,40}$/),accountHolder:str}),
 document:z.object({recipientName:z.string().max(200).optional().default(''),recipientAddress:optional,billingMonth:z.union([month,z.literal('')]).optional().default(''),sourceQuotationId:z.string().max(200).optional().default(''),paymentAccounts:z.array(z.object({bankName:str,accountNumber:z.string().trim().regex(/^[0-9 -]{5,40}$/),accountHolder:str})).max(10).optional().default([]),type:z.enum(['Quotation','Invoice']),number:str,date,period:str,notes:optional,terms:optional,items:z.array(z.object({description:str,detail:optional,qty:z.coerce.number().min(0.01).max(10000),price:amount,serviceMonth:z.union([month,z.literal('')]).optional().default('')})).min(1).max(50),issuer:str,company:str}),
};
