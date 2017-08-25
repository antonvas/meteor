/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { chai } from 'meteor/practicalmeteor:chai';
import spies from 'chai-spies';
import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';

chai.use(spies);

import { withRenderedTemplate } from '../test-helpers.js';

if (Meteor.isClient) {
    import '../../../client/global.js';
    import './attributeForm.js';

    describe('attributeForm', function () {
        let data;

        beforeEach(function () {
            // Template.registerHelper('_', key => key);
            data = {
                attribute: {name: 'testName', value: 'testValue'},
            };
        });

        afterEach(function () {
            Template.deregisterHelper('_');
        });

        it('renders correctly in view mode', function () {
            withRenderedTemplate('attributeForm', data, el => {
                chai.assert.equal($(el).find('input[type=text]').length, 0);
                chai.assert.equal($(el).find('th.attribute-name').text(), 'testName');
                chai.assert.equal($(el).find('td.attribute-value').text(), 'testValue');
                chai.assert.equal($(el).find('button.attribute-edit').length, 1);
                chai.assert.equal($(el).find('button.attribute-delete').length, 1);
            });
        });

        it('renders correctly in isNew mode', function () {
            delete data.attribute;
            data.isNew = true;

            withRenderedTemplate('attributeForm', data, el => {
                chai.assert.equal($(el).find('input[type=text]').length, 2);
                chai.assert.equal($(el).find('input[name=attribute_name_]').val(), '');
                chai.assert.equal($(el).find('input[name=attribute_value_]').val(), '');
                chai.assert.equal($(el).find('button.attribute-save').length, 1);
                chai.assert.equal($.trim($(el).find('button.attribute-save').text()), 'Add attribute');
                chai.assert.equal($(el).find('button.attribute-cancel-edit').length, 0);
            });
        });

        it('renders correctly in edit mode', function () {
            data.edit = true;
            data.index = 1;

            withRenderedTemplate('attributeForm', data, el => {
                chai.assert.equal($(el).find('input[type=text]').length, 2);
                chai.assert.equal($(el).find('input[name=attribute_name_1]').val(), 'testName');
                chai.assert.equal($(el).find('input[name=attribute_value_1]').val(), 'testValue');
                chai.assert.equal($(el).find('button.attribute-save').length, 1);
                chai.assert.equal($.trim($(el).find('button.attribute-save').text()), 'Save attribute');
                chai.assert.equal($(el).find('button.attribute-cancel-edit').length, 1);
            });
        });

        it('allow to switch from view to edit', function () {
            withRenderedTemplate('attributeForm', data, el => {
                chai.assert.equal($(el).find('input[type=text]').length, 0);

                $(el).find('button.attribute-edit').click();
                Tracker.flush();

                chai.assert.equal($(el).find('input[type=text]').length, 2);
            });
        });

        it('allow to switch from edit to view with cancel', function () {
            data.edit = true;
            data.index = 1;

            withRenderedTemplate('attributeForm', data, el => {
                chai.assert.equal($(el).find('input[type=text]').length, 2);
                $(el).find('input[name=attribute_name_1]').val('updatedName');
                $(el).find('input[name=attribute_value_1]').val('updatedValue');


                $(el).find('button.attribute-cancel-edit').click();
                Tracker.flush();

                chai.assert.equal($(el).find('input[type=text]').length, 0);
                chai.assert.equal($(el).find('th.attribute-name').text(), 'testName');
                chai.assert.equal($(el).find('td.attribute-value').text(), 'testValue');
            });
        });

        it('allow to switch from edit to view with save', function () {
            data.edit = true;
            data.index = 1;
            data.onSubmit = chai.spy(function(index, attribute, isDelete) {
                data.attribute = attribute;
                Tracker.flush();
            });

            withRenderedTemplate('attributeForm', data, el => {
                chai.assert.equal($(el).find('input[type=text]').length, 2);
                $(el).find('input[name=attribute_name_1]').val('updatedName');
                $(el).find('input[name=attribute_value_1]').val('updatedValue');


                $(el).find('button.attribute-save').click();
                expect(data.onSubmit).to.have.been.called();
                Tracker.flush();

                chai.assert.equal($(el).find('input[type=text]').length, 0);
                chai.assert.equal($(el).find('th.attribute-name').text(), 'updatedName');
                chai.assert.equal($(el).find('td.attribute-value').text(), 'updatedValue');
            });
        });
    });
}