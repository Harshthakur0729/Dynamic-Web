import mongoose from "mongoose";

const websiteStyleSchema = new mongoose.Schema({
    headerSection: {
        headerbgColour: { type: String },
        headerfontColour: { type: String },
        headerfontWeight: { type: String },
        headerfontfamily: { type: String },
        headerfontSize: { type: String }
    },

    footerSection: {
        footerColour: { type: String },
        headingfontColour: { type: String },
        headingfontWeight: { type: String },
        headingfontSize: { type: String },
        headingfontFamily: { type: String },

        headingRoutesfontColour: { type: String },
        headingRoutesfontWeight: { type: String },
        headingRoutesfontSize: { type: String },
        headingRoutesfontFamily: { type: String },

        CopyrightfontColour: { type: String },
        CopyrightfontWeight: { type: String },
        CopyrightfontSize: { type: String },
        CopyrightfontFamily: { type: String }
    },

    breadcrumbSection: {
        breadcrumbColour: { type: String },
        breadcrumbfontsize: { type: String },
        breadcrumbfontColour_1: { type: String },
        breadcrumbfontColour_2: { type: String },
        breadcrumb_fontWeight_1: { type: String },
        breadcrumb_fontWeight_2: { type: String },
        breadcrumbfontfamily_1: { type: String },
        breadcrumbfontfamily_2: { type: String }
    },

    heroSection: {
        herobgColour: { type: String },
        herofontColour: { type: String },
        herofontFamily: { type: String },
        herofontWeight: { type: String },
        herobtnfontWeight: { type: String },
        herobtnfontColour: { type: String },
        herobtnfontFamily: { type: String },
        buttonColour: { type: String }
    },

    imageSection: {
        pagesbg1: { type: String },
        pagesbg2: { type: String },
        imgheadingFontColour: { type: String },
        imgheadingFontWeight: { type: String },
        imgheadingFontFamily: { type: String },
        imgfontWeight: { type: String },
        imgfontColour: { type: String },
        imgfontSize: { type: String },
        imgfontFamily: { type: String }
    },

    termsSection: {
        termsbgColour: { type: String },
        titlefontWeight: { type: String },
        titlefontFamily: { type: String },
        titlefontSize: { type: String },
        titlefontColour: { type: String },

        subtitlefontWeight: { type: String },
        subtitlefontFamily: { type: String },
        subtitlefontSize: { type: String },
        subtitlefontColour: { type: String },

        pointfontWeight: { type: String },
        pointfontFamily: { type: String },
        pointfontSize: { type: String },
        pointfontColour: { type: String },

        subpointfontWeight: { type: String },
        subpointfontFamily: { type: String },
        subpointfontSize: { type: String },
        subpointfontColour: { type: String }
    },

    teamSection: {
        teambgColour: { type: String },
        titlefontWeight: { type: String },
        titlefontFamily: { type: String },
        titlefontSize: { type: String },
        titlefontColour: { type: String },

        name_role_fontWeight: { type: String },
        name_role_fontFamily: { type: String },
        name_role_fontSize: { type: String },
        name_role_fontColour: { type: String },

        descriptionfontWeight: { type: String },
        descriptionfontFamily: { type: String },
        descriptionfontSize: { type: String },
        descriptionfontColour: { type: String }
    },

    contactSection: {
        contactColour: { type: String },
        contactheadingfontWeight: { type: String },
        contactheadingfontFamily: { type: String },
        contactheadingfontColour: { type: String },
        contactInputbgColour: { type: String },
        contactinputFontColour: { type: String },
        contactinputFontFamily: { type: String },
        contactbtnbgColour: { type: String },
        contactbtnColour: { type: String },
        contactbtnFontFamily: { type: String },
        contactbtnFontWeight: { type: String }
    },

    faqSection: {
        faqbgColour: { type: String },
        faqheadingfontWeight: { type: String },
        faqheadingfontFamily: { type: String },
        faqheadingfontColour: { type: String },

        faqQfontWeight: { type: String },
        faqQfontFamily: { type: String },
        faqQfontColour: { type: String },
        faqQfontSize: { type: String },

        faqAfontWeight: { type: String },
        faqAfontFamily: { type: String },
        faqAfontColour: { type: String },
        faqAfontSize: { type: String }
    }
});

const WebsiteStyle = mongoose.model("WebsiteStyle", websiteStyleSchema);
export default WebsiteStyle;
