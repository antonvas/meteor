import { Template } from 'meteor/templating';

import './View.html';

Template.View.helpers({
    patient() {
        return Template.instance().data;
    },
    hasCustomAttributes() {
        const patient = Template.instance().data;
        return patient && patient.customAttributes && patient.customAttributes.length;
    }
});
