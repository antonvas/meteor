import { Template } from 'meteor/templating';

import './pagination.html';

Template.pagination.helpers({
    showPagination() {
        // Flag to detect show/hide for pagination.
        return Template.instance().data.totalPages > 1;
    },
    pages() {
        const {totalPages} = Template.instance().data;
        // Build pages array to use in view.
        // Each element is increasing number (1 based).
        const pages = [];
        for (let i = 0; i < totalPages; i++) {
            pages.push(i+1);
        }
        return pages;
    },
    isActive(page) {
        // Flag to detect active page.
        return Template.instance().data.activePage === page;
    },
});

Template.pagination.events({
    'click .btn'(event, instance) {
        event.preventDefault();
        // Call callback when page clicked.
        instance.data.onChange(parseInt(event.target.rel, 10));
    },
});

