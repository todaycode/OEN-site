<a name="1.0.0-alpha.3"></a>
# [1.0.0-alpha.3](https://github.com/ng-bootstrap/ng-bootstrap/compare/1.0.0-alpha.2...1.0.0-alpha.3) (2016-08-30)

This release adds support for the modal service. Cross-browser compatibility was reviewed and improved. We now support all the browsers supported by Angular 2 and Bootstrap, including IE9.
There are also small features and bug fixes for the existing widgets - see the details below. 

### Bug Fixes

* **typeahead:** cleans up subscription on component destroy ([5dcecae](https://github.com/ng-bootstrap/ng-bootstrap/commit/5dcecae)), closes [#620](https://github.com/ng-bootstrap/ng-bootstrap/issues/620)
* fix the error emitted by TS due to missing generic type ([976ff34](https://github.com/ng-bootstrap/ng-bootstrap/commit/976ff34)), closes [#622](https://github.com/ng-bootstrap/ng-bootstrap/issues/622)

### Features

* support IE9 ([5514a97](https://github.com/ng-bootstrap/ng-bootstrap/commit/5514a97)), closes [#604](https://github.com/ng-bootstrap/ng-bootstrap/issues/604)
* **modal:** add initial version of the modal service ([3ef99c5](https://github.com/ng-bootstrap/ng-bootstrap/commit/3ef99c5)), closes [#3](https://github.com/ng-bootstrap/ng-bootstrap/issues/3)
* **typeahead:** add support for the 'select' output ([c0dd7b7](https://github.com/ng-bootstrap/ng-bootstrap/commit/c0dd7b7)), closes [#606](https://github.com/ng-bootstrap/ng-bootstrap/issues/606) [#610](https://github.com/ng-bootstrap/ng-bootstrap/issues/610)



<a name="1.0.0-alpha.2"></a>
# [1.0.0-alpha.2](https://github.com/ng-bootstrap/ng-bootstrap/compare/1.0.0-alpha.1...1.0.0-alpha.2) (2016-08-10)

This release makes the code compatible with Angular 2.0.0-rc.5.  
There are also small features and bug fixes for the existing widgets - see the details below.

### Bug Fixes

* **buttons:** don't interfere with 'active' class ([af4de2a](https://github.com/ng-bootstrap/ng-bootstrap/commit/af4de2a)), closes [#557](https://github.com/ng-bootstrap/ng-bootstrap/issues/557) [#559](https://github.com/ng-bootstrap/ng-bootstrap/issues/559)
* **progressbar:** reorder 'value' and 'max' attribute bindings for IE ([30e20f5](https://github.com/ng-bootstrap/ng-bootstrap/commit/30e20f5)), closes [#543](https://github.com/ng-bootstrap/ng-bootstrap/issues/543) [#544](https://github.com/ng-bootstrap/ng-bootstrap/issues/544)
* **timepicker:** format input values on blur ([d9ac911](https://github.com/ng-bootstrap/ng-bootstrap/commit/d9ac911)), closes [#511](https://github.com/ng-bootstrap/ng-bootstrap/issues/511) [#517](https://github.com/ng-bootstrap/ng-bootstrap/issues/517)
* **timepicker:** propagate only valid model values ([8c4144a](https://github.com/ng-bootstrap/ng-bootstrap/commit/8c4144a)), closes [#513](https://github.com/ng-bootstrap/ng-bootstrap/issues/513) [#516](https://github.com/ng-bootstrap/ng-bootstrap/issues/516)
* **typeahead:** resolves window items excessive rendering ([862fbc5](https://github.com/ng-bootstrap/ng-bootstrap/commit/862fbc5)), closes [#526](https://github.com/ng-bootstrap/ng-bootstrap/issues/526)
* **typeahead:** specify any type for formatters argument ([86c3644](https://github.com/ng-bootstrap/ng-bootstrap/commit/86c3644)), closes [#553](https://github.com/ng-bootstrap/ng-bootstrap/issues/553) [#554](https://github.com/ng-bootstrap/ng-bootstrap/issues/554)
* don't accept string as boolean input ([190b7ec](https://github.com/ng-bootstrap/ng-bootstrap/commit/190b7ec)), closes [#552](https://github.com/ng-bootstrap/ng-bootstrap/issues/552)
* don't accept string as number input ([f49fb08](https://github.com/ng-bootstrap/ng-bootstrap/commit/f49fb08)), closes [#560](https://github.com/ng-bootstrap/ng-bootstrap/issues/560)

### Features

* **timepicker:** allow hiding the spinners ([dc4962d](https://github.com/ng-bootstrap/ng-bootstrap/commit/dc4962d)), closes [#510](https://github.com/ng-bootstrap/ng-bootstrap/issues/510) [#519](https://github.com/ng-bootstrap/ng-bootstrap/issues/519)
* **typeahead:** set autocomplete, autocapitalize and autocorrect off ([46024c3](https://github.com/ng-bootstrap/ng-bootstrap/commit/46024c3)), closes [#520](https://github.com/ng-bootstrap/ng-bootstrap/issues/520) [#525](https://github.com/ng-bootstrap/ng-bootstrap/issues/525)


### BREAKING CHANGES

* number inputs in pagination could previously be set as strings. The values passed were transformed to numbers if necessary and rounded to integers. This is not supported anymore. All number inputs should now consistently be set as number, using the syntax `[attr]="value"` (for example: `<ngb-pagination [pageSize]="20" ...></ngb-pagination>` instead of `<ngb-pagination pageSize="20" ...></ngb-pagination>`), and rounding is not applied anymore.
* boolean inputs in progressbar and pagination could be set by just adding the attribute
(for example: `<ngb-progressbar striped></ngb-progressbar>`). This is not supported anymore.
All boolean inputs must now consistently be set using the syntax `[attr]="value"`
(for example: `<ngb-progressbar [striped]="true"></ngb-progressbar>`).
* you need to use `@NgModule`s to setup your application. Check https://ng-bootstrap.github.io/#/getting-started for more details.



<a name="1.0.0-alpha.1"></a>
# [1.0.0-alpha.1](https://github.com/ng-bootstrap/ng-bootstrap/compare/1.0.0-alpha.0...1.0.0-alpha.1) (2016-07-29)

This release adds support for 2 new directives ([timepicker](https://ng-bootstrap.github.io/#/components/timepicker) and [typeahead](https://ng-bootstrap.github.io/#/components/typeahead)) and updates Bootstrap support to 4.0.0-alpha.3.
There are also small features and bug fixes for the existing widgets - see the details below.

### Bug Fixes

* **dropdown:** use button elements instead of links ([aeeee01](https://github.com/ng-bootstrap/ng-bootstrap/commit/aeeee01)), closes [#490](https://github.com/ng-bootstrap/ng-bootstrap/issues/490)
* **pagination:** display proper cursor on each page ([dca96fd](https://github.com/ng-bootstrap/ng-bootstrap/commit/dca96fd)), closes [#492](https://github.com/ng-bootstrap/ng-bootstrap/issues/492)
* **progressbar:** don't add bogus CSS classes ([56ea4c5](https://github.com/ng-bootstrap/ng-bootstrap/commit/56ea4c5)), closes [#496](https://github.com/ng-bootstrap/ng-bootstrap/issues/496)
* **rating:** set cursor on stars of rating component ([#411](https://github.com/ng-bootstrap/ng-bootstrap/issues/411)) ([bcba259](https://github.com/ng-bootstrap/ng-bootstrap/commit/bcba259))


### Features

* **accordion:** add panels type option ([b5ad117](https://github.com/ng-bootstrap/ng-bootstrap/commit/b5ad117)), closes [#420](https://github.com/ng-bootstrap/ng-bootstrap/issues/420) [#431](https://github.com/ng-bootstrap/ng-bootstrap/issues/431)
* **timepicker:** add timepicker widget
* **typeahead:** add typeahead widget

### BREAKING CHANGES

* **accordion:** accordion implementation was overhauled to use cards instead of deprecated panels. Refer to the API docs and [demo page](https://ng-bootstrap.github.io/#/components/accordion) for more details.  
* **pager:** support for the pager widget was removed as the result of its removal from Bootstrap's CSS.  


<a name="1.0.0-alpha.0"></a>
# [1.0.0-alpha.0](https://github.com/ng-bootstrap/ng-bootstrap/compare/9f8f37b...1.0.0-alpha.0) (2016-07-08)

### Features

Initial release with the following directives:

* accordion
* alert
* buttons
* carousel
* collapse
* dropdown
* pager
* pagination
* popover
* progressbar
* rating
* tabset
* tooltip