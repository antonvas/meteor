import { Template } from 'meteor/templating';

Template.registerHelper('currentRouteIs', (route) => {
    return Router.current().route && (Router.current().route.getName() === route);
});

Template.registerHelper('dateFormat', (date) => {
    return moment(date).format('MM/DD/YYYY');
});

Template.registerHelper('dateTimeFormat', (date) => {
    return moment(date).format('MM/DD/YYYY h:mma');
});


Template.registerHelper('dateToInput', (date) => {
    return moment(date).format('YYYY-MM-DD');
});

Template.registerHelper('patientGender', (gender) => {
    return gender.charAt(0).toUpperCase() + gender.substr(1);
});