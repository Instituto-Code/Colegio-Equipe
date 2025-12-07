import User from "../models/User.js";

export const UserRepository = {
    findByEmail(email: string){
        return User.findOne({ email });
    },

    findById(id: string){
        return User.findById(id);
    },

    create(data: any){
        return User.create(data);
    },

    save(user: any){
        return user.save();
    },

    upadate(id: string, data: any){
        return User.findByIdAndUpdate(id, data, { new: true });
    }
}