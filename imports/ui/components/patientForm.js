import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Patients } from '../../api/patients.js';

import './patientForm.html';
import './attributeForm.js';

const PATIENT_GENDER = {
    MALE: 'male',
    FEMALE: 'female',
    OTHER: 'other',
    UNKNOWN: 'unknown',
};

Template.patientForm.onCreated(function (){
    // Store customAttributes as reactive var,
    // to allow interface react on changes.
    this.customAttributes = new ReactiveVar([]);
    if (!this.data || !this.data.patient) {
        // New patient.
        this.patient = {};
    } else {
        // Existing patient.
        this.patient = this.data.patient;
        this.customAttributes.set(this.patient.customAttributes || []);
    }
});

Template.patientForm.helpers({
    patient() {
        return Template.instance().patient;
    },
    isPatientGender(gender) {
        // Helper to detect active option in gender select.
        return gender === Template.instance().patient.gender;
    },
    genders() {
        return [
            {value: PATIENT_GENDER.UNKNOWN, text: 'Unknown'},
            {value: PATIENT_GENDER.MALE, text: 'Male'},
            {value: PATIENT_GENDER.FEMALE, text: 'Female'},
            {value: PATIENT_GENDER.OTHER, text: 'Other'},
        ];
    },
    customAttributes() {
        return Template.instance().customAttributes.get();
    },
    updateAttribute() {
        const customAttributes = Template.instance().customAttributes;
        // Return callback to communicate with attributeForm.
        return (index, attribute, isDelete) => {
            if (index === false) {
                // New attribute -- just add the value.
                customAttributes.set([...customAttributes.get(), attribute]);
            } else {
                if (isDelete) {
                    // Delete attribute -- remove element with given index.
                    customAttributes.set([
                        ...customAttributes.get().slice(0, index),
                        ...customAttributes.get().slice(index + 1),
                    ]);
                } else {
                    // Update attribute by replacement.
                    customAttributes.set([
                        ...customAttributes.get().slice(0, index),
                        attribute,
                        ...customAttributes.get().slice(index + 1),
                    ]);
                }
            }
        }
    }
});

Template.patientForm.events({
    'submit .patient-form'(event, instance) {
        event.preventDefault();

        const form = event.target;

        // Build patient from form values and customAttributes.
        // dateOfBirthStr to allow user search by date.
        const patient = {
            name: form.name.value,
            dateOfBirth: new Date(form.dateOfBirth.value),
            dateOfBirthStr: form.dateOfBirth.value,
            gender: form.gender.value,
            customAttributes: instance.customAttributes.get(),
            updatedAt: new Date(),
        };

        if (instance.patient._id) {
            // This is existing patient.
            Patients.update({_id: instance.patient._id}, patient);
        } else {
            // For new patient set date.
            patient.createdAt = new Date();

            Patients.insert(patient);
        }

        // Redirect to home after updates.
        Router.go('home');
    },
});

