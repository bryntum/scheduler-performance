# JavaScript scheduler performance comparison

A performance comparison of six popular JavaScript scheduler components. Measures the initial rendering time and scroll 
performance for the following schedulers:

* Bryntum Scheduler, https://www.bryntum.com/products/scheduler

To set each product up, please see the README.md files in the corresponding folders.

## Methodology
To make comparison as fair as possible the following actions were taken:

* All schedulers have additional features (such as grouping, sorting) turned off.
* The same dataset consisting of 2,500 resources and 50,000 events (20 per resource) in JSON format is used throughout.
* Schedulers have been configured with the same set of columns, with custom cell renderers matching each other as close 
as possible.
* All use the same size on their container: 1024 x 768 px.
* Scrollbars where turned on.

Measurements where taken using the same approach and same code for the different schedulers:

* Timer for initial rendering started after page and data has loaded, before scheduler instance is created and populated 
with the data. Timer stopped when scheduler is completely rendered, which for some schedulers is a sync operation while 
others requires listening for an event.
* Scroll FPS measured by using a JS frame counter and changing scroll programmatically. Time taken to reach a predefined 
scroll distance was measured and used to calculate an average FPS value.

## Results

All measurements taken on a 2016 MacBook Pro 13-inch (2 GHz Intel Core i5, 8GB RAM).

| Grid          | Small rendering   | Small FPS   | Large rendering | Large FPS | 
|---------------|-------------------|-------------|-----------------|-----------|
| Bryntum       | 291 ms            | 60          | 666 ms          | 48        |
| DevExtreme    | 12507 ms          | 25          | Failed          | -         |
| DHTMLX        | 192 ms            | 53          | 579             | 31        |
| FullCalendar  | 437 ms            | 36          | 18,791 ms       | 0.5       |
| Kendo         | 2636 ms           | 23          | 108,642 ms      | ~0        |
| SyncFusion    | 1891 ms           | 9           | 2095 ms         | 3         |

The full set of results can be viewed in this [Google Sheet](https://docs.google.com/spreadsheets/d/1zZ7YqjYycOfx2oR25QRJWU6W3gHb7qSksqN6rnY6dyg)
