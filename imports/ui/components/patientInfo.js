import { Template } from 'meteor/templating';
import { Patients } from '../../api/patients.js';

import './patientInfo.html';

Template.patientInfo.helpers({
    getData() {
        // Helper to build the links.
        return {_id: this._id};
    },
});

Template.patientInfo.events({
    'click .delete'() {
        BootstrapModalPrompt.prompt({
            title: 'Delete user',
            content: `Do you really want to delete user "${this.name}"?`,
            btnDismissText: 'Cancel',
            btnOkText: 'Delete',
        }, function(result) {
            if (result) {
                Patients.remove(this._id);
            }
        });
    },
});

