import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    review: { type: String, required: true },
    loc: { type: { type: String}, coordinates: [Number]},
    imageUrl: { type: String},
    hasBookmark:  { type: Boolean, default: false},
    date: { type: Date, default: Date.now}
},
    {
        toJSON: {
            virtuals: true,
            versionKey: false,
            transform: (doc, ret) => {
                ret._links = {
                    self: {
                        href: `${process.env.APPLICATION_URL}:${process.env.EXPRESS_PORT}/teams/${ret.id}`, // id word zelf gemaakt door mongoose
                    },
                    collection: {
                        href: `${process.env.APPLICATION_URL}:${process.env.EXPRESS_PORT}/teams`, // collection linkt naar de hoofd pagina waar de informatie in komt te staan
                    },
                };
                delete ret._id;
            },
        },
    });

const team = mongoose.model("team", teamSchema);

export default team;