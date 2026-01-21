import mongoose from "mongoose";
import { faker } from '@faker-js/faker';

const teamSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    review: { type: String, required: true },
    // generate faker location
        loc: {
            type: { type: String, default: 'Point' },
            coordinates: { type: [Number] }
        },
    imageUrl: { type: String,  required: true },
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

teamSchema.pre('save', function(next) {
    if (!this.loc || !this.loc.coordinates || this.loc.coordinates.length === 0) {
        this.loc = {
            type: 'Point',
            coordinates: [
                parseFloat(faker.location.longitude()),
                parseFloat(faker.location.latitude())
            ]
        };
    }
});

const team = mongoose.model("team", teamSchema);

export default team;