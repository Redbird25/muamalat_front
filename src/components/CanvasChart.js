import React, {Component} from 'react';
import CanvasJSReact from '@canvasjs/react-charts';

let CanvasJSChart = CanvasJSReact.CanvasJSChart;

class CanvasChart extends Component {
  constructor() {
    super();
    this.toggleDataSeries = this.toggleDataSeries.bind(this);
  }
  
  toggleDataSeries(e) {
    if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
      e.dataSeries.visible = false;
    } else {
      e.dataSeries.visible = true;
    }
    this.chart.render();
  }
  
  render() {
    const options = {
      theme: "light2",
      animationEnabled: true,
      axisX: {
        valueFormatString: "MMM",
        tickThickness: 0,
        gridThickness: 1,
        gridColor: "#F1F1F5",
        lineThickness: 0,
        labelFontColor: "#92929D",
      },
      axisY: {
        valueFormatString: "#0,.",
        suffix: "K",
        labelFontColor: "#92929D",
        gridThickness: 0,
        tickThickness: 0,
        prefix: "$",
      },
      toolTip: {
        shared: true
      },
      legend: {
        cursor: "pointer",
        fontSize: 16,
        verticalAlign: "top",
        horizontalAlign: "center",
        markerMargin: 10,
        fontWeight: "normal",
        itemclick: this.toggleDataSeries
      },
      data: [{
        yValueFormatString: "#,### Units",
        xValueFormatString: "MMM",
        type: "spline",
        name: "Снижение",
        color: "#0062FF",
        showInLegend: true,
        dataPoints: [
          {x: new Date(2017, 0, 0), y: 2506000},
          {x: new Date(2017, 2, 2), y: 2798000},
          {x: new Date(2017, 3, 3), y: 3386000},
          {x: new Date(2017, 4, 4), y: 6944000},
          {x: new Date(2017, 5, 5), y: 6026000},
          {x: new Date(2017, 6, 6), y: 2394000},
          {x: new Date(2017, 7, 7), y: 1872000},
          {x: new Date(2017, 8, 8), y: 2140000},
          {x: new Date(2017, 9, 9), y: 7289000},
          {x: new Date(2017, 10, 10), y: 4830000},
          {x: new Date(2017, 11, 11), y: 2009000},
          {x: new Date(2017, 12, 12), y: 2840000},
        ]
      },
        {
          yValueFormatString: "#,### Units",
          xValueFormatString: "MMM",
          type: "spline",
          name: "Рост",
          color: "#3DD598",
          showInLegend: true,
          dataPoints: [
            {x: new Date(2017, 0, 0), y: 2606000},
            {x: new Date(2017, 2, 2), y: 2198000},
            {x: new Date(2017, 3, 3), y: 3386000},
            {x: new Date(2017, 4, 4), y: 6974000},
            {x: new Date(2017, 5, 5), y: 2026000},
            {x: new Date(2017, 6, 6), y: 2394000},
            {x: new Date(2017, 7, 7), y: 3872000},
            {x: new Date(2017, 8, 8), y: 2180000},
            {x: new Date(2017, 9, 9), y: 2289000},
            {x: new Date(2017, 10, 10), y: 8830000},
            {x: new Date(2017, 11, 11), y: 6209000},
            {x: new Date(2017, 12, 12), y: 3710000},
          ]
        }],
      options: {
        plugins: [{
          beforeInit: function (chart, options) {
            chart.legend.afterFit = function () {
              this.height = this.height + 350;
            };
          }
        }]
      }
    }
    
    
    return (
      <CanvasJSChart options={options}
                     onRef={ref => this.chart = ref}
      />
    );
  }
  
}

export default CanvasChart;