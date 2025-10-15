import mongoose, { Schema, Types } from "mongoose";

interface IMensalidade {
    aluno: Types.ObjectId;
    valor: number;
    vencimento: Date;
    status: 'pendente' | 'pago' | 'atrasado';
    pagamento: Types.ObjectId[];
}

// Schema de mensalidades
const MensalidadeSchema = new Schema<IMensalidade>({

    aluno: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Aluno'
    },

    valor: Number,

    vencimento: Date,

    status: { 
        type: String, 
        enum: ['pendente', 'pago', 'atrasado'], 
        default: 'pendente' 
    },

    pagamento: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Pagamento' 
    }]

});

export default mongoose.model<IMensalidade>("Mensalidade", MensalidadeSchema);
