import { Patients } from '../imports/api/patients.js';

Router.configure({
    layoutTemplate: 'Layout'
});

Router.route('/', {
    name: 'home',
    action: function () {
        return this.render('List');
    }
});

Router.route('/add', {
    name: 'add'
});

Router.route('/view/:_id', {
    name: 'view',
    data: function () {
        return Patients.findOne({_id: this.params._id});
    }
});

Router.route('/edit/:_id', {
    name: 'edit',
    data: function () {
        return Patients.findOne({_id: this.params._id});
    }
});
