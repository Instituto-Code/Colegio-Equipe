import mongoose, { Schema, Types } from "mongoose";

interface IPagamento {
    mensalidade: Types.ObjectId;
    metodo: 'cartao' | 'boleto' | 'pix';
    status: 'pendente' | 'aprovado' | 'falhou';
    dataPagamento?: Date;
    referencia: string;
    pagarmeId?: string;
    valor: number;
    boletoUrl?: string;
    qrCodeUrl?: string;
}

const PagamentoSchema = new Schema<IPagamento>({

    mensalidade: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Mensalidade',
        required: true
    },

    metodo: { 
        type: String, 
        enum: ['cartao', 'boleto', 'pix'],
        required: true
    },

    status: { 
        type: String, 
        enum: ['pendente', 'aprovado', 'falhou'], 
        default: 'pendente' 
    },

    valor: {
        type: Number,
        required: true
    },

    dataPagamento: Date,

    referencia: {
        type: String,
        required: true
    },

    pagarmeId: { type: String },

    boletoUrl: { type: String },

    qrCodeUrl: { type: String },
});

export default mongoose.model<IPagamento>("Pagamento", PagamentoSchema);
