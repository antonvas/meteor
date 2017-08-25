import { Template } from 'meteor/templating';

import '../components/patientForm.js';
import './Edit.html';

Template.Edit.helpers({
    patient() {
        return Template.instance().data;
    },
});
