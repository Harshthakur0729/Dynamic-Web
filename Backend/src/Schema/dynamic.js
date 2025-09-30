import mongoose from "mongoose";

const DyanmicSchema = new mongoose.Schema({
    page: { type: String, required: true, unique: true },
    breadcrumb: {
        home: { type: String },
        current: { type: String },
    },


    hero: {
        heading: { type: String },
        button: {
            text: { type: String },
            link: { type: String },
        },
        image: { type: String },
    },

    images: {
        title: { type: String },
        cards: [
            {
                title: { type: String },
                image: { type: String },
            },
        ],
    },


    content: [
        {
            terms: {
                title: String,
                subtitles: [   // ek array of objects
                    {
                        subtitle: String,
                        points: [
                            {
                                text: String,
                                subpoints: [String]
                            }
                        ]
                    }
                ]
            },
            team: [
                {
                    title: String,
                    members: [
                        {
                            name: String,
                            role: String,
                            image: String,
                            description: String
                        }
                    ]
                }
            ]
        }
    ],


    contactForm: {
        heading: { type: String },
        fields: [
            {
                type: { type: String, enum: ["text", "tel", "email", "textarea", "number"] },
                name: { type: String },
                placeholder: { type: String },

            },
        ],
        button: {
            text: { type: String },
        },
    },

    faqs: {
        heading: { type: String },
        faqsList: [
            {
                question: { type: String },
                answer: { type: String },
            },
        ]
    },

    menuPlacement: {
        header: { type: Boolean, default: false },
        dropdown: { type: Boolean, default: false },
        footer: { type: Boolean, default: false },
        top_pages: { type: Boolean, default: false }
    },

},
    { timestamps: true }
);
const Dyanmic = mongoose.model("StaticZupeePage", DyanmicSchema);
export default Dyanmic
