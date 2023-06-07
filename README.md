# DI Chart Boilerplate

A starting point for creating charts & maps (D3, Plotly, ECharts)

## Usage

### Pre-requisites

	npm install -g nwb
	
	npm install papaparse

You must also ensure that your node.js/npm directory is on PATH.

### Dev

        npm start

This starts the dev environment, compiling the javascript and css. Changes to JS & CSS files trigger a page refresh in the browser

### Build

        npm run build

Build files are copied into the `dist` folder. It is from these files that the contents of the assets folder are updated

To update the assets, copy the contents of the relevant files from the dist folder (`app.*.js`, `app.*.css`, `runtime.*.js`) into their 
respective destinations in the assets folder

### Copy Bundled Assets

        gulp

This copies the required assets from the generated dist folder to the assets folder


## Configuring visualisations & other dashboard widgets

The current codebase allows users to configure:
- Basic charts (bar, line, pie, area). It's probably possible to configure more advanced chart types, when the need arises.
- A Ugandan map, with the capability to focus on specific regions e.g. districts
- A tabbed view of statistics.
- A global dropdown selector that can be used to control the context of a page's visualisations.


Visualisations are configured through the global state.

        const state = {/* chart configs go here */ };
        window.DIState.setState(state);

The code expects data to be contain the following key properties:
1. Each row must reference data of a particular year
2. One column should correspond to a series e.g. a column `ownership` with two possible values `Government` & `Private` will create 2 series, one for each value.
3. Each row must have a data value. This shall correspond to comparable points on the visualisation.

e.g. to create a simple bar chart

        const state = {
                charts: {
                        className: 'classname-of-root-element',
                        data: [
                                { year: 2015, ownership: 'Government', value: 120 },
                                { year: 2015, ownership: 'Private', value: 200 },
                                { year: 2016, ownership: 'Government', value: 150 },
                                { year: 2016, ownership: 'Private', value: 80 },
                                { year: 2017, ownership: 'Government', value: 70 },
                                { year: 2017, ownership: 'Private', value: 120 },
                        ],
                        type: 'bar',
                        series: ['Government', 'Private'],
                        mapping: {
                                series: 'ownership',
                                year: 'year',
                                value: 'value',
                        },
                }
        };
        window.DIState.setState(state);


### Charts Config

Here a full configuration for charts, with a provision to toggle between a chart and a table.

        const state = {
                charts: {
                        className: '', // a class on the DOM element you want to render the chart on
                        data: [], // an object array - optional. Take precendence over `url`
                        url: '', // a data URL. Can be anything from CSV to JSON, or an API endpoint that returns JSON. Ignored if the data property is provided.
                        type: '', // type of chart. Options are `bar`, `area`, `line`, `column`. This can be overwritten in the options config.
                        series: [], // specifies the series rendered by this chart. The series mapping must have matching values (see mapping property).
                        mapping: { // used to map the provided data to expected properties. It removes the limitation of column names.
                                series: '', // name of the series column
                                year: '', // name of the year column
                                value: '', // name of the value column
                        },
                        typeOptions: [], // used to specify which chart type options are available. e.g. [{ value: 'bar', label: 'Bar Chart' }, { value: 'line', label: 'Line Chart' }],
                        yearRange: [], // number array of length 2 - minimum and maximum year to show on the x-axis e.g. [2010, 2020] generates a range of years from 2010 to 2020.
                        excludeYears: [], // number array - years to exclude from the x-axis year range. Used to eliminate gaps.
                        aggregator: '', // two options - `sum` and `avg`. For multiple rows of the same year and series, a value of sum adds up all matching rows, and avg calculates their average.
                        filters: { // used to filter specific columns e.g. see below
                                ownership: ['primary'], // will filter the data, returning only rows that have ownership == primary.
                        },
                        options: {}, // echarts options as specified here https://echarts.apache.org/en/option.html - use to customise your chart
                        selectors: [ // used to configure dropdown selectors that filter chart data in realtime. Allows chart specific change of context.
                                {
                                        data: [ // dropdown options - the value should match expected data in the valueProperty
                                                { value: 'primary', label: 'Primary' },
                                                { value: 'secondary', label: 'Secondary' }
                                        ],
                                        url: '', // for dynamic dropdown options - only one of this and data are required
                                        label: 'Select level', // dropdown label
                                        defaultValue: { value: 'all', label: 'Primary and secondary' }, // dropdown default value - use `all` for when no filter is active.
                                        valueProperty: 'value', // maps to the value column in the data
                                        labelProperty: 'label', // maps to the label column in the data
                                        dataProperty: 'level' // maps to the data column in the data
                                }
                        ],
                        table: { // when present & configured correctly, shows buttons that toggle between the chart view and table view
                                yearRange: [], // same as chart yearRange
                                rows: ['Government', 'Private'], // maps a data row to a particular property/column - equivalent to a chart series
                                mapping: { // maps data to expected options.
                                        rows: 'Type', // row column name
                                        year: 'year', // year column name
                                        value: 'Value', // value column name
                                },
                        },
                }
        }
