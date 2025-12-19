
import mongoose from 'mongoose';

const permissionSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    module: { type: String, required: true },   // Project, Payroll
    action: { type: String, required: true },   // View, Create
    code: { type: String, required: true, unique: true }
}, { timestamps: true });

export default mongoose.model('Permission', permissionSchema);
