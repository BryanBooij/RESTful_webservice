import mongoose from "mongoose";

const spotSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    review: { type: Number, required: true },
    loc: { type: { type: String}, coordinates: [Number]},
    // locationType: { type: String, enum: ['park','library','street','store','other'], default: 'other'},
    // imageUrl: { type: String, required: true},
    // hasBookmark:  { type: Boolean, default: false},
    date: { type: Date, default: Date.now}
},
    {
        toJSON: {
            virtuals: true,
            versionKey: false,
            transform: (doc, ret) => {
                ret._links = {
                    self: {
                        href: `${process.env.APPLICATION_URL}:${process.env.EXPRESS_PORT}/spots/${ret.id}`, // id word zelf gemaakt door mongoose
                    },
                    collection: {
                        href: `${process.env.APPLICATION_URL}:${process.env.EXPRESS_PORT}/spots`, // collection linkt naar de hoofd pagina waar de informatie in komt te staan
                    },
                };
                delete ret._id;
            },
        },
    });

const spot = mongoose.model("Spot", spotSchema);

export default spot;