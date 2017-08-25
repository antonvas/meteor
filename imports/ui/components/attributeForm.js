import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './attributeForm.html';

Template.attributeForm.onCreated(function (){
    // Flag to detect edit mode for attribute form.
    this.edit = new ReactiveVar(false);
    if (this.data.edit || this.data.isNew) {
        // New attribute should always be in edit mode.
        this.edit.set(true);
    }
});

Template.attributeForm.helpers({
    attribute() {
        return Template.instance().data.attribute;
    },
    index() {
        return Template.instance().data.index;
    },
    edit() {
        return Template.instance().edit.get();
    },
    isNew() {
        return Template.instance().data.isNew;
    },
});

Template.attributeForm.events({
    'click .attribute-edit'(event, instance) {
        event.preventDefault();

        instance.edit.set(true);
    },
    'click .attribute-cancel-edit'(event, instance) {
        event.preventDefault();

        instance.edit.set(false);
    },
    'click .attribute-save'(event, instance) {
        event.preventDefault();

        const isAdd = instance.data.index === false;
        const index = isAdd ? '' : instance.data.index;

        const nameInput = document.getElementById(`attribute-name-${index}`);
        const valueInput = document.getElementById(`attribute-value-${index}`);

        // Build new attribute from input values.
        // Add extra updatedAt to track changes.
        const attribute = {
            name: nameInput.value,
            value: valueInput.value,
            updatedAt: new Date(),
        };
        // Use component callback to pass data to parent component.
        instance.data.onSubmit(instance.data.index, attribute);

        if (isAdd) {
            // In case of add attribute -- clean input values.
            nameInput.value = '';
            valueInput.value = '';
        } else {
            instance.edit.set(false);
        }
    },
    'click .attribute-delete'(event, instance) {
        event.preventDefault();

        const {onSubmit, attribute, index} = instance.data;

        BootstrapModalPrompt.prompt({
            title: 'Delete attribute',
            content: `Do you really want to delete attribute with name "${attribute.name}"?`,
            btnDismissText: 'Cancel',
            btnOkText: 'Delete',
        }, function(result) {
            if (result) {
                // Third argument -- to detect delete.
                // @see patientForm.js
                onSubmit(index, {}, true);
            }
        });
    },
});

