import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Patients } from '../../api/patients.js';

import '../components/patientInfo.js';
import '../components/pagination.js';
import './List.html';

const PAGE_SIZE = 10;

Template.List.onCreated(function (){
    // Search criteria.
    this.search = new ReactiveVar('');
    // Current page.
    this.page = new ReactiveVar(1);
    // Query builder.
    this.getQuery = function() {
        const search = this.search.get();
        const query = {};
        if (search) {
            // If search criteria is set, filter patients.
            query.$or = [
                {name: new RegExp(search, 'i')},
                {dateOfBirthStr: new RegExp(search, 'i')},
            ];
        }

        return query;
    };
});

Template.List.helpers({
    patients() {
        const instance = Template.instance();
        return Patients.find(
            instance.getQuery(),
            {
                sort: { updatedAt: -1 },
                limit: PAGE_SIZE,
                skip: (instance.page.get() - 1)*PAGE_SIZE,
            }
        );
    },
    activePage() {
        return Template.instance().page.get();
    },
    totalPages() {
        const total = Patients.find(Template.instance().getQuery()).count();
        return Math.ceil(total/PAGE_SIZE);
    },
    totalCount() {
        return Patients.find(Template.instance().getQuery()).count();
    },
    onChangePage() {
        const instance = Template.instance();
        // Callback to react on page change.
        return function(page) {
            instance.page.set(page);
        }
    },
});

Template.List.events({
    'submit .find-patients'(event, instance) {
        event.preventDefault();
        instance.search.set(event.target.search.value);
    },
});
