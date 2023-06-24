<script lang="jsx">
import { GChart } from 'vue3-googl-chart';
import VueTypes from 'vue-types';
import { defineComponent } from 'vue';

export const GoogleBasicBarChart = defineComponent({
    name: 'GoogleBasicBarChart',
    components: {
        GChart,
    },
    setup(props) {
        const chartOptions = {
            title: props.title,
            width: props.width,
            height: props.height,
            chartArea: { width: props.chartArea },
            hAxis: {
                title: 'Total',
                minValue: 0,
            },
            vAxis: {
                title: 'City',
            },
        };
        return {
            chartOptions,
        };
    },
    props: {
        type: VueTypes.string.def('BarChart'),
        width: VueTypes.string.def('100%'),
        height: VueTypes.number.def(300),
        data: VueTypes.array,
        title: VueTypes.string.def('Chart'),
        chartArea: VueTypes.string.def('50%'),
    },
    render() {
        return (
            <GChart
                type={this.type}
                data={this.data}
                options={this.chartOptions}
                rootProps={{ 'data-testid': '1' }}
            />
        );
    },
});
export const BubbleChart = defineComponent({
    name: 'BubbleChart',
    components: {
        GChart,
    },
    setup(props) {
        const chartOptions = {
            width: props.width,
            height: props.height,
            colorAxis: { colors: props.colors },
        };
        return {
            chartOptions,
        };
    },
    props: {
        type: VueTypes.string.def('BubbleChart'),
        width: VueTypes.string.def('100%'),
        height: VueTypes.number.def(300),
        data: VueTypes.array,
        colors: VueTypes.array.def(['#b0120a', '#ffab91']),
    },
    render() {
        return (
            <GChart
                type={this.type}
                data={this.data}
                options={this.chartOptions}
            />
        );
    },
});
export const GoogleMaterialBarChart = defineComponent({
    name: 'GoogleMaterialBarChart',
    components: {
        GChart,
    },
    setup(props) {
        const chartOptions = {
            chart: {
                title: props.title,
                subtitle: props.subtitle,
            },
            width: props.width,
            height: props.height,
            chartArea: { width: props.chartArea },
        };
        return {
            chartOptions,
        };
    },
    props: {
        type: VueTypes.string.def('ColumnChart'),
        width: VueTypes.string.def('100%'),
        height: VueTypes.number.def(300),
        data: VueTypes.array,
        title: VueTypes.string.def('Chart'),
        chartArea: VueTypes.string.def('50%'),
        subtitle: VueTypes.string.def('subtitle'),
    },
    render() {
        return (
            <GChart
                type={this.type}
                data={this.data}
                options={this.chartOptions}
                rootProps={{ 'data-testid': '2' }}
                height={this.height}
            />
        );
    },
});

export const GoogleStackedChart = defineComponent({
    name: 'GoogleStackedChart',
    components: {
        GChart,
    },
    setup(props) {
        const chartOptions = {
            chart: {
                title: props.title,
            },
            width: props.width,
            height: props.height,
            chartArea: { width: props.chartArea },
            isStacked: true,
            hAxis: {
                title: 'Total',
                minValue: 0,
            },
            vAxis: {
                title: 'City',
            },
        };
        return {
            chartOptions,
        };
    },
    props: {
        type: VueTypes.string.def('BarChart'),
        width: VueTypes.string.def('100%'),
        height: VueTypes.number.def(300),
        data: VueTypes.array,
        title: VueTypes.string.def('Chart'),
        chartArea: VueTypes.string.def('50%'),
    },
    render() {
        return (
            <GChart
                type={this.type}
                data={this.data}
                options={this.chartOptions}
                rootProps={{ 'data-testid': '3' }}
                height={this.height}
            />
        );
    },
});

export const GoogleCustomColorChart = defineComponent({
    name: 'GoogleCustomColorChart',
    components: {
        GChart,
    },
    setup(props) {
        const chartOptions = {
            title: props.title,
            width: props.width,
            height: props.height,
            colors: props.colors,
            chartArea: { width: props.chartArea },
            hAxis: {
                title: 'Total',
                minValue: 0,
            },
            vAxis: {
                title: 'City',
            },
        };
        return {
            chartOptions,
        };
    },
    props: {
        type: VueTypes.string.def('BarChart'),
        width: VueTypes.string.def('100%'),
        height: VueTypes.number.def(300),
        data: VueTypes.array,
        title: VueTypes.string.def('Chart'),
        chartArea: VueTypes.string.def('50%'),
        colors: VueTypes.array,
    },
    render() {
        return (
            <GChart
                type={this.type}
                data={this.data}
                options={this.chartOptions}
                rootProps={{ 'data-testid': '4' }}
            />
        );
    },
});

export const GoogleComboChart = defineComponent({
    name: 'GoogleComboChart',
    components: {
        GChart,
    },
    setup(props) {
        const chartOptions = {
            title: props.title,
            width: props.width,
            height: props.height,
            colors: props.colors,
            chartArea: { width: props.chartArea },
            seriesType: 'bars',
            series: { 5: { type: 'line' } },
        };
        return {
            chartOptions,
        };
    },
    props: {
        type: VueTypes.string.def('ComboChart'),
        width: VueTypes.string.def('100%'),
        height: VueTypes.number.def(300),
        data: VueTypes.array,
        title: VueTypes.string.def('Chart'),
        chartArea: VueTypes.string.def('50%'),
        colors: VueTypes.array,
    },
    render() {
        return (
            <GChart
                type={this.type}
                data={this.data}
                options={this.chartOptions}
                rootProps={{ 'data-testid': '5' }}
            />
        );
    },
});

export const GoogleLineChart = defineComponent({
    name: 'GoogleLineChart',
    components: {
        GChart,
    },
    setup(props) {
        const chartOptions = {
            width: props.width,
            height: props.height,
            hAxis: {
                title: 'Time',
            },
            vAxis: {
                title: 'Popularity',
            },
        };
        return {
            chartOptions,
        };
    },
    props: {
        type: VueTypes.string.def('LineChart'),
        width: VueTypes.string.def('100%'),
        height: VueTypes.number.def(300),
        data: VueTypes.array,
    },
    render() {
        return (
            <GChart
                type={this.type}
                data={this.data}
                options={this.chartOptions}
                rootProps={{ 'data-testid': '6' }}
            />
        );
    },
});

export const GoogleMultiLineChart = defineComponent({
    name: 'GoogleMultiLineChart',
    components: {
        GChart,
    },
    setup(props) {
        const chartOptions = {
            width: props.width,
            height: props.height,
            hAxis: {
                title: 'Time',
            },
            vAxis: {
                title: 'Popularity',
            },
            series: {
                0: { curveType: 'function' },
                1: { curveType: 'function' },
            },
        };
        return {
            chartOptions,
        };
    },
    props: {
        type: VueTypes.string.def('LineChart'),
        width: VueTypes.string.def('100%'),
        height: VueTypes.number.def(300),
        data: VueTypes.array,
    },
    render() {
        return (
            <GChart
                type={this.type}
                data={this.data}
                options={this.chartOptions}
                rootProps={{ 'data-testid': '7' }}
            />
        );
    },
});

export const GoogleBasicPieChart = defineComponent({
    name: 'GoogleBasicPieChart',
    components: {
        GChart,
    },
    setup(props) {
        const chartOptions = {
            title: props.title,
            width: props.width,
            height: props.height,
            chartArea: { width: props.chartArea },
        };
        return {
            chartOptions,
        };
    },
    props: {
        type: VueTypes.string.def('PieChart'),
        width: VueTypes.string.def('100%'),
        height: VueTypes.number.def(300),
        data: VueTypes.array,
        title: VueTypes.string.def('My Daily Activities'),
        chartArea: VueTypes.string.def('50%'),
    },
    render() {
        return (
            <GChart
                type={this.type}
                data={this.data}
                options={this.chartOptions}
                rootProps={{ 'data-testid': '9' }}
            />
        );
    },
});

export const Google3dPieChart = defineComponent({
    name: 'Google3dPieChart',
    components: {
        GChart,
    },
    setup(props) {
        const chartOptions = {
            title: props.title,
            width: props.width,
            height: props.height,
            is3D: true,
            chartArea: { width: props.chartArea },
        };
        return {
            chartOptions,
        };
    },
    props: {
        type: VueTypes.string.def('PieChart'),
        width: VueTypes.string.def('100%'),
        height: VueTypes.number.def(300),
        data: VueTypes.array,
        title: VueTypes.string.def('My Daily Activities'),
        chartArea: VueTypes.string.def('50%'),
    },
    render() {
        return (
            <GChart
                type={this.type}
                data={this.data}
                options={this.chartOptions}
                rootProps={{ 'data-testid': '9' }}
            />
        );
    },
});

export default GoogleBasicBarChart;
</script>
