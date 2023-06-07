<script>
import { GChart } from "vue3-googl-chart";

export const GoogleBasicBarChart = {
  name: "GoogleBasicBarChart",
  components: {
    GChart,
  },
  data() {
    return {
      chartOptions: {
        title: this.title,
        width: this.width,
        height: this.height,
        chartArea: { width: this.chartArea },
        hAxis: {
          title: "Total",
          minValue: 0,
        },
        vAxis: {
          title: "City",
        },
      },
    };
  },
  methods: {},
  props: {
    type: "BarChart",
    width: "100%",
    height: 300,
    data: [],
    title: "Chart",
    chartArea: "50%",
  },
  render() {
    return (
      '<GChart type="' +
      this.type +
      '" data="' +
      this.data +
      '" options="' +
      this.chartOptions +
      "\" rootProps=\"{ 'data-testid': '1' }\" />"
    );
  },
};

export const BubbleChart = {
  name: "BubbleChart",
  components: {
    GChart,
  },
  data() {
    return {
      chartOptions: {
        width: this.width,
        height: this.height,
        colorAxis: { colors: this.colors },
      },
    };
  },
  methods: {},
  props: {
    type: "BubbleChart",
    width: "100%",
    height: 300,
    data: [],
    colors: ["#b0120a", "#ffab91"],
  },
  render() {
    return (
      '<GChart type="' +
      this.type +
      '" data="' +
      this.data +
      '" options="' +
      this.chartOptions +
      '" />'
    );
  },
};

export const GoogleMaterialBarChart = {
  name: "GoogleMaterialBarChart",
  components: {
    GChart,
  },
  data() {
    return {
      chartOptions: {
        chart: {
          title: this.title,
          subtitle: this.subtitle,
        },
        width: this.width,
        height: this.height,
        chartArea: { width: this.chartArea },
      },
    };
  },
  methods: {},
  props: {
    type: "ColumnChart",
    width: "100%",
    height: 300,
    data: [],
    title: "Chart",
    chartArea: "50%",
    subtitle: "subtitle",
  },
  render() {
    return (
      '<GChart type="' +
      this.type +
      '" data="' +
      this.data +
      '" options="' +
      this.chartOptions +
      "\" rootProps=\"{ 'data-testid': '2' }\" height=\"" +
      this.height +
      '" />'
    );
  },
};

export const GoogleStackedChart = {
  name: "GoogleStackedChart",
  components: {
    GChart,
  },
  data() {
    return {
      chartOptions: {
        chart: {
          title: this.title,
        },
        width: this.width,
        height: this.height,
        chartArea: { width: this.chartArea },
        isStacked: true,
        hAxis: {
          title: "Total",
          minValue: 0,
        },
        vAxis: {
          title: "City",
        },
      },
    };
  },
  methods: {},
  props: {
    type: "BarChart",
    width: "100%",
    height: 300,
    data: [],
    title: "Chart",
    chartArea: "50%",
  },
  render() {
    return (
      '<GChart type="' +
      this.type +
      '" data="' +
      this.data +
      '" options="' +
      this.chartOptions +
      "\" rootProps=\"{ 'data-testid': '3' }\" height=\"" +
      this.height +
      '" />'
    );
  },
};

export const GoogleCustomColorChart = {
  name: "GoogleCustomColorChart",
  components: {
    GChart,
  },
  data() {
    return {
      chartOptions: {
        title: this.title,
        width: this.width,
        height: this.height,
        colors: this.colors,
        chartArea: { width: this.chartArea },
        hAxis: {
          title: "Total",
          minValue: 0,
        },
        vAxis: {
          title: "City",
        },
      },
    };
  },
  methods: {},
  props: {
    type: "BarChart",
    width: "100%",
    height: 300,
    data: [],
    title: "Chart",
    chartArea: "50%",
    colors: [],
  },
  render() {
    return (
      '<GChart type="' +
      this.type +
      '" data="' +
      this.data +
      '" options="' +
      this.chartOptions +
      "\" rootProps=\"{ 'data-testid': '4' }\" />"
    );
  },
};

export const GoogleComboChart = {
  name: "GoogleComboChart",
  components: {
    GChart,
  },
  data() {
    return {
      chartOptions: {
        title: this.title,
        width: this.width,
        height: this.height,
        colors: this.colors,
        chartArea: { width: this.chartArea },
        seriesType: "bars",
        series: { 5: { type: "line" } },
      },
    };
  },
  methods: {},
  props: {
    type: "ComboChart",
    width: "100%",
    height: 300,
    data: [],
    title: "Chart",
    chartArea: "50%",
    colors: [],
  },
  render() {
    return (
      '<GChart type="' +
      this.type +
      '" data="' +
      this.data +
      '" options="' +
      this.chartOptions +
      "\" rootProps=\"{ 'data-testid': '5' }\" />"
    );
  },
};

export const GoogleLineChart = {
  name: "GoogleLineChart",
  components: {
    GChart,
  },
  data() {
    return {
      chartOptions: {
        width: this.width,
        height: this.height,
        hAxis: {
          title: "Time",
        },
        vAxis: {
          title: "Popularity",
        },
      },
    };
  },
  methods: {},
  props: {
    type: "LineChart",
    width: "100%",
    height: 300,
    data: [],
  },
  render() {
    return (
      '<GChart type="' +
      this.type +
      '" data="' +
      this.data +
      '" options="' +
      this.chartOptions +
      "\" rootProps=\"{ 'data-testid': '6' }\" />"
    );
  },
};

export const GoogleMultiLineChart = {
  name: "GoogleMultiLineChart",
  components: {
    GChart,
  },
  data() {
    return {
      chartOptions: {
        width: this.width,
        height: this.height,
        hAxis: {
          title: "Time",
        },
        vAxis: {
          title: "Popularity",
        },
        series: {
          0: { curveType: "function" },
          1: { curveType: "function" },
        },
      },
    };
  },
  methods: {},
  props: {
    type: "LineChart",
    width: "100%",
    height: 300,
    data: [],
  },
  render() {
    return (
      '<GChart type="' +
      this.type +
      '" data="' +
      this.data +
      '" options="' +
      this.chartOptions +
      "\" rootProps=\"{ 'data-testid': '7' }\" />"
    );
  },
};

export const GoogleBasicPieChart = {
  name: "GoogleBasicPieChart",
  components: {
    GChart,
  },
  data() {
    return {
      chartOptions: {
        title: this.title,
        width: this.width,
        height: this.height,
        chartArea: { width: this.chartArea },
      },
    };
  },
  methods: {},
  props: {
    type: "PieChart",
    width: "100%",
    height: 300,
    data: [],
    title: "My Daily Activities",
    chartArea: "50%",
  },
  render() {
    return (
      '<GChart type="' +
      this.type +
      '" data="' +
      this.data +
      '" options="' +
      this.chartOptions +
      "\" rootProps=\"{ 'data-testid': '9' }\" />"
    );
  },
};

export const Google3dPieChart = {
  name: "Google3dPieChart",
  components: {
    GChart,
  },
  data() {
    return {
      chartOptions: {
        title: this.title,
        width: this.width,
        height: this.height,
        is3D: true,
        chartArea: { width: this.chartArea },
      },
    };
  },
  methods: {},
  props: {
    type: "PieChart",
    width: "100%",
    height: 300,
    data: [],
    title: "My Daily Activities",
    chartArea: "50%",
  },
  render() {
    return (
      '<GChart type="' +
      this.type +
      '" data="' +
      this.data +
      '" options="' +
      this.chartOptions +
      "\" rootProps=\"{ 'data-testid': '9' }\" />"
    );
  },
};

export default GoogleBasicBarChart;
</script>
