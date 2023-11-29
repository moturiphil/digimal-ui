<template>
    <Main>
        <sdPageHeader title="M & E Dashboard">
            <template v-slot:buttons>
                <div class="page-header-actions">
                    <router-link v-bind:to="'campaigns/create-campaign'">
                        <!-- <sdButton size="small" type="success">
              <sdFeatherIcons type="plus" size="14" class="icon-color-white" />
              Create Campaign
            </sdButton> -->
                    </router-link>
                </div>
                <a-row>
                    <a-col v-if="filterAccessList.includes('country')">
                        <a-select v-model:value="country" show-search placeholder="Select Country" style="width: 200px"
                            :options="countries" :filter-option="filterOption"
                            @change="handleChange($event, 'country')"></a-select>
                    </a-col>
                    <a-col v-if="filterAccessList.includes('county')">
                        <a-select v-model:value="county" show-search placeholder="Select County" style="width: 200px"
                            :options="counties" :filter-option="filterOption"
                            @change="handleChange($event, 'county')"></a-select>
                    </a-col>
                    <a-col v-if="filterAccessList.includes('subcounty')">
                        <a-select v-model:value="subcounty" show-search placeholder="Select Sub County" style="width: 200px"
                            :options="subcounties" :filter-option="filterOption"
                            @change="handleChange($event, 'subcounty')"></a-select>
                    </a-col>
                    <a-col v-if="filterAccessList.includes('ward')">
                        <a-select v-model:value="ward" show-search placeholder="Select Ward" style="width: 200px"
                            :options="wards" :filter-option="filterOption"
                            @change="handleChange($event, 'ward')"></a-select>
                    </a-col>
                    <a-col v-if="filterAccessList.includes('location')">
                        <a-select v-model:value="location" show-search placeholder="Select Location" style="width: 200px"
                            :options="locations" :filter-option="filterOption"
                            @change="handleChange($event, 'location')"></a-select>
                    </a-col>
                    <a-col v-if="filterAccessList.includes('sublocation')">
                        <a-select v-model:value="sublocation" show-search placeholder="Select Sub Location"
                            style="width: 200px" :options="sublocations" :filter-option="filterOption"
                            @change="handleChange($event, 'sublocation')"></a-select>
                    </a-col>
                </a-row>
            </template>
        </sdPageHeader>
        <div class="">
            <a-row :gutter="6">
                <a-button @click="exportChartsToPDF()" :style="{ panding: '2px', border: 'solid 1px 2%' }">
                    <FilePdfOutlined /> Print Pdf
                </a-button>
            </a-row>
            <div id="printPDFDiv">
                <a-row :gutter="25" class="pdf-row">
                    <a-col :xxl="24" :md="24" :sm="24" :xs="24">
                        <figure class="highcharts-figure">
                            <div id="TargetedvsCoveredChart"></div>
                        </figure>
                    </a-col>
                    <a-col :xxl="24" :md="24" :sm="24" :xs="24">
                        <figure class="highcharts-figure">
                            <div id="EstimatedvsRegisteredHouseholdpouplation"></div>
                            <table class="table nested-table table-responsive" style="max-width: 100%;" v-if="printMode">
                                <thead>
                                    <tr>
                                        <th v-for="item in NetsChartData" :key="item.name">{{ item.name }}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td v-for="item in NetsChartData" :key="item.name">
                                            <table class="nested-table" style="max-width: 100%;">
                                                <tbody>
                                                    <tr>
                                                        <td style="font-weight:bold;font-style:italic;">Estimated Population</td>
                                                        <td style="font-weight:bold;font-style:italic;">Population
                                                        Registered
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>{{ parseInt(item.households_registered) || 0 }}</td>
                                                        <td>{{ parseInt(item.house_holds_served) || 0 }}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </figure>
                    </a-col>
                </a-row>
            </div>
        </div>
        <a-notification :message="errorMessage" type="error" :description="errorDescription" :showIcon="true" :duration="0"
            :style="{ width: '100%' }" />
    </Main>
</template>
<script setup>
//import { CardBarChart2, EChartCard } from "./style";
import { Main } from "../styled";
//import { defineComponent } from "vue"; //defineAsyncComponent
//import authHeader from "../../services/auth-header";
import Highcharts from 'highcharts';
import axios from '@/Axiosconfig';
import { notification } from "ant-design-vue";
import { onMounted, ref } from 'vue';
// import moment from "moment"
import exporting from 'highcharts/modules/exporting';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
//import html2pdf from 'html2pdf.js';
import { FilePdfOutlined } from '@ant-design/icons-vue';

exporting(Highcharts);
//chart data
const newChartData = ref([])
const TargetedvsCoveredChartData = ref([])
var printMode = ref(false)
//org levels
const access_level = ref({})
const filterAccessList = ref([])
const countries = ref([{ value: "HfVjCurKxh2", label: "Kenya" }])
const counties = ref(null)
const subcounties = ref(null)
const wards = ref(null)
const locations = ref(null)
const sublocations = ref(null)
const country = ref("Select Country")
const county = ref("Select County")
const sublocation = ref("Select Sublocation")
const subcounty = ref("Select Subcounty")
const location = ref("Select Location")
const ward = ref("Select Ward")

var filterOrgId = ref(9)
var fileterOrgeLevel = ref("")

const org_ids = ref([])
const selectedCounties = ref([
    "Homa Bay County",
    "Kisii County",
    "Nyamira County",
    // "Kisumu County",
    // "Siaya County",
    // "Busia County",
    // "Migori County",
    // "Lamu County",
    // "Kilifi County",
    // "Tana River County",
    // "Kwale County",
    // "Taita Taveta County",
    // "Mombasa County",
    // "Bungoma County",
    // "Kakamega County",
    // "Vihiga County",
    // "West Pokot County",
    // "Turkana County",
    // "Trans Nzoia County",
    // "Narok County",
    // "Marsabit County",
    // "Baringo County",
    // "Kirinyaga County"
])
const currentCounties = ref([
    'nK0A12Q7MvS',//homa bay
    'sPkRcDvhGWA',//kisii
    'uepLTG8wGWJ',//nyamira
    // 'u4t9H8XyU9P',//siaya
    // 'fVra3Pwta0Q',//migori
    // 'Tvf1zgVZ0K4',//busia
    // 'NjWSbQTwys4',//lamu
    // 'nrI2khZx3d0',//kilifi
    // 'JsH2bnvNt2d',//tan river
    // 'N7YETT3A9r1',//kwale
    // 'QyGNX2DpR4h',//taita taveta
    // 'wsBsC6gjHvn',// mombasa
    // 'KGHhQ5GLd4k',//
    // 'BjC1xL40gHo',//kakamega
    // 'sANMZ3lpqGs',//vihiga
    // 'XWALbfAPa6n',//west pokot
    // 'kphDeKClFch',//turkana
    // 'mThvosEflAU',//trans nzoia
    // 'kqJ83J2D72s',//naraok
    // 'Eey8fT4Im3y',//marsabit
    // 'vvOK1BxTbet',//baringo
    // 'Ulj33KBau7V',
])
onMounted(async () => {
    if (sessionStorage.getItem("user")) {
        access_level.value = JSON.parse(sessionStorage.getItem("user")).user;
        updateFilters()
        fetchInitialChartData()
    }
});
const capitalizeFirstLetter = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
};
const updateFilters = () => {
    // access_level.value.level.id = 3
    // access_level.value.location.org_id = 'BzFBYZhF5fx'
    // access_level.value.location.name = 'Kabondo Kasipul Sub County'

    if (access_level.value.level.id == 1) {
        filterAccessList.value = ['county', 'subcounty', 'ward', 'location', 'sublocation', 'village']
        countries.value = [{ value: access_level.value.location.org_id, label: access_level.value.location.name }]
        org_ids.value = [{ id: access_level.value.location.id, org_id: access_level.value.location.org_id }]
        fetchCounties()
    } else if (access_level.value.level.id == 2) {
        filterAccessList.value = ['county', 'subcounty', 'ward', 'location', 'sublocation', 'village']
        counties.value = [{ value: access_level.value.location.org_id, label: access_level.value.location.name }]
        org_ids.value = [{ id: access_level.value.location.id, org_id: access_level.value.location.org_id }]
    } else if (access_level.value.level.id == 3) {
        filterAccessList.value = ['subcounty', 'ward', 'location', 'sublocation', 'village']
        subcounties.value = [{ value: access_level.value.location.org_id, label: access_level.value.location.name }]
        org_ids.value = [{ id: access_level.value.location.id, org_id: access_level.value.location.org_id }]
    } else if (access_level.value.level.id == 4) {
        filterAccessList.value = ['ward', 'location', 'sublocation', 'village']
        wards.value = [{ value: access_level.value.location.org_id, label: access_level.value.location.name }]
        org_ids.value = [{ id: access_level.value.location.id, org_id: access_level.value.location.org_id }]
    } else if (access_level.value.level.id == 5) {
        filterAccessList.value = ['location', 'sublocation', 'village']
        locations.value = [{ value: access_level.value.location.org_id, label: access_level.value.location.name }]
        org_ids.value = [{ id: access_level.value.location.id, org_id: access_level.value.location.org_id }]
    } else if (access_level.value.level.id == 6) {
        filterAccessList.value = ['sublocation', 'village']
        sublocations.value = [{ value: access_level.value.location.org_id, label: access_level.value.location.name }]
        org_ids.value = [{ id: access_level.value.location.id, org_id: access_level.value.location.org_id }]
    }
}
const fetchInitialChartData = async () => {
    axios.get(`subcounty/stats?org_id=${access_level.value.location.org_id}`)
        .then(response => {
            newChartData.value = response.data.data;
            if (access_level.value.level.id === 1) {
                newChartData.value = newChartData.value.filter(e => selectedCounties.value.includes(e.name.toString()));
            }
            //let pieOptionsData = newChartData.value.map(item => ({ name: item.name, y: item.households_registered }))
            TargetedvsCoveredChart([{name:"Counties Covered",y:10,sliced: true}, { name: "Gap", y: 12,sliced: true }],)//
            //registered,served,target_data,target_level,cats
            EstimatedvsRegisteredHouseholdpouplation(
                newChartData.value.map(item => parseInt(item.households_registered)),//registered
                newChartData.value.map(item => parseInt(item.households_served)),//served
                newChartData.value.map(item => item.name),//cats
                access_level.value.level.level_name,//level
            )
        }).catch(error => {
            console.log(error)
            notification.error({
                message: `Initial Data Error!`,
                description: `${error}`,
            });
        })
}
const handleChange = async (org_id, org_level) => {
    //fetch child data
    let org = org_ids.value.filter(x => x.org_id === org_id).map(e => e.id)
    console.log(org_id)
    console.log(org_ids.value)
    let parent_id = org[0] || 9
    console.log(parent_id)
    console.log(org_level)
    fetchChildData(org_id, org_level)
    filterOrgId.value = parent_id
    fileterOrgeLevel.value = org_level
};
const fetchChildData = async (org_id, org_level) => {
    let fetchUrl = `get_sub_counties_list`
    let statUrl = `subcounty/stats`
    if (org_level == 'country') {//get counties
        fetchUrl += `?parent_id=${org_id}`
        statUrl += `?org_id=${org_id}`
        //clear fields
        county.value = "Select County"
        subcounty.value = "Select SubCounty"
        ward.value = " Select Ward"
        location.value = "Select Location"
        sublocation.value = "Select Sub Location"
    } else if (org_level == 'county') {//get subcounties
        fetchUrl += `?parent_id=${org_id}`
        statUrl += `?org_id=${org_id}`
        //clear fields
        subcounty.value = "Select SubCounty"
        ward.value = " Select Ward"
        location.value = "Select Location"
        sublocation.value = "Select Sub Location"
    } else if (org_level == 'subcounty') {//get wards
        fetchUrl += `?parent_id=${org_id}`
        statUrl += `?org_id=${org_id}`
        //clear fields
        ward.value = " Select Ward"
        location.value = "Select Location"
        sublocation.value = "Select Sub Location"
    } else if (org_level == 'ward') {//get locatios
        fetchUrl += `?parent_id=${org_id}`
        statUrl += `?org_id=${org_id}`
        //clear fields
        location.value = "Select Location"
        sublocation.value = "Select Sub Location"
    } else if (org_level == 'location') {//get sub locatios
        fetchUrl += `?parent_id=${org_id}`
        statUrl += `?org_id=${org_id}`
        //clear fields
        sublocation.value = "Select Sub Location"
    } else if (org_level == 'sublocation') {//get sublocations stats
        statUrl += `?org_id=${org_id}`
    }
    await axios.get(`${fetchUrl}`)
        .then(response => {
            let data = response.data.message;
            if (org_level == 'country') {//get counties
                counties.value = data.map(x => ({
                    value: x.org_id,
                    label: x.name
                }));
                org_ids.value = data.map(x => ({ org_id: x.org_id, id: x.id }))
                counties.value.splice(0, 1)
            } else if (org_level == 'county') {//get subcounties
                subcounties.value = data.map(x => ({
                    value: x.org_id,
                    label: x.name
                }));
                org_ids.value = data.map(x => ({ org_id: x.org_id, id: x.id }))
            } else if (org_level == 'subcounty') {//get wards
                wards.value = data.map(x => ({
                    value: x.org_id,
                    label: x.name
                }));
                org_ids.value = [
                    ...org_ids.value,
                    ...data
                        .map(x => ({ org_id: x.org_id, id: x.id }))
                        .filter(newItem => !org_ids.value.some(existingItem => existingItem.id === newItem.id))
                ];
            } else if (org_level == 'ward') {//get locations
                locations.value = data.map(x => ({
                    value: x.org_id,
                    label: x.name
                }));
                org_ids.value = [...org_ids.value, ...data.map(x => ({ org_id: x.org_id, id: x.id }))];
            } else if (org_level == 'location') {//get sublocations
                sublocations.value = data.map(x => ({
                    value: x.org_id,
                    label: x.name
                }));
                org_ids.value = [
                    ...org_ids.value,
                    ...data
                        .map(x => ({ org_id: x.org_id, id: x.id }))
                        .filter(newItem => !org_ids.value.some(existingItem => existingItem.id === newItem.id))
                ];
            }
        }).then(async () => {
            await axios.get(`${statUrl}`)
                .then(response => {
                    newChartData.value = response.data.data;
                    if (org_level === 'country') {
                        newChartData.value = newChartData.value.filter(e => selectedCounties.value.includes(e.name.toString()));
                    }
                    fileterOrgeLevel.value = org_level
                    //column Subcounty comparison
                    let rgstd = newChartData.value.map(item => parseInt(item.households_registered))//registered
                    let srvd = newChartData.value.map(item => parseInt(item.households_served))//served
                    let cats = newChartData.value.map(item => item.name)//cats
                    org_level = capitalizeFirstLetter(fileterOrgeLevel.value);
                    EstimatedvsRegisteredHouseholdpouplation(rgstd,srvd,cats,org_level)
                    //combine bar line bar Subcounty comparison
                    //pie chars Registered households by sub county
                    let pieOptionsData = newChartData.value.map(item => ({ name: item.name, y: item.households_registered }))
                    let chartData = newChartData.value.map(item => ({ name: item.name, y: item.households_served }))
                    TargetedvsCoveredChart([{ name: "Counties Covered", y: 10 }, { name: "Gap", y: 12 }])
                    TargetedvsCoveredChartData.value = pieOptionsData
                    HouseHoldsServedbyCountyChart(chartData, org_level)
                    fileterOrgeLevel.value = org_level
                })
        }).catch(error => {
            notification.error({
                message: `Error!`,
                description: `${error}`,
            });
        });
}
const fetchCounties = async () => {
    axios.get('counties/')
        .then(response => {
            counties.value = response.data.map(x => ({
                value: x.org_id,
                label: x.name
            })).filter(e => currentCounties.value.includes(e.value.toString()));
            org_ids.value = [...org_ids.value, ...response.data.map(x => ({ org_id: x.org_id, id: x.id }))];
        }).catch(error => {
            console.log(error)
            notification.error({
                message: `Couties Error!`,
                description: `${error}`,
            });
        })
}
const filterOption = (input, option) => {
    return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};
//chart pdf reports
// Function to export multiple charts to a single PDF
const exportChartsToPDF = async () => {
    printMode.value = true;
    const content = document.getElementById('printPDFDiv');

    // Create a new jsPDF instance
    const pdf = new jsPDF({
        orientation: 'potrait',
        unit: 'mm',
        format: 'a4',
    });
    // Get all rows in the content
    const rows = content.querySelectorAll('.pdf-row');
    // Loop through each row
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        // Use html2canvas to convert the row to a canvas
        const canvas = await html2canvas(row);
        // Add the canvas as an image to the PDF
        pdf.addImage(canvas.toDataURL('image/jpeg'), 'JPEG', 10, 10, 190, 277);
        // If there are more rows, add a new page for the next row
        if (i < rows.length - 1) {
            pdf.addPage();
        }
    }
    // Save or display the PDF
    // You can modify this part based on your specific needs
    pdf.save('export.pdf');
    // printMode.value = false;
    window.location.reload()
};

const TargetedvsCoveredChart = (data) => {
    Highcharts.chart('TargetedvsCoveredChart', {
        chart: {
            type: 'pie'
        },
        credits: {
            enabled: false,
        },
        title: {
            text: `Proportion of targeted Counties completed microplanning`,
            align: 'left',
        },
        subtitle: {
            text: '',
            align: 'left'
        },
        tooltip: {
            valueSuffix: ''
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                borderWidth: 2,
                cursor: 'pointer',
                innerSize: '0%',
                slicedOffset: 20,
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b><br>{point.percentage:.1f}%',
                    distance: 20
                }
            },
        },
        series: [
            {
                name: 'Count',
                colorByPoint: true,
                data: data,
            }
        ],
    });
}
const EstimatedvsRegisteredHouseholdpouplation = (estimated, rgstd, cats, orglevel) => {
    Highcharts.chart('EstimatedvsRegisteredHouseholdpouplation', {
        chart: {
            type: 'column'
        },
        // Custom option for templates
        cats,
        title: {
            text: 'Estimated Population vs Registered Population by ' + orglevel,
            align: 'left'
        },
        plotOptions: {
            series: {
                grouping: false,
                borderWidth: 0
            }
        },
        legend: {
            layout: 'horizontal',
            align: 'center',
            x: 80,
            verticalAlign: 'top',
            y: 10,
            floating: true,
            backgroundColor:
                Highcharts.defaultOptions.legend.backgroundColor || // theme
                'rgba(255,255,255,0.25)'
        },
        tooltip: {
            shared: true,
            headerFormat: '<span style="font-size: 15px">' +
                '{series.chart.options.cats.(point.key).name}' +
                '</span><br/>',
            pointFormat: '<span style="color:{point.color}">\u25CF</span> ' +
                '{series.name}: <b>{point.y} records</b><br/>'
        },
        xAxis: {
            type: 'category',
            accessibility: {
                description: 'Distribution by Administrative Level'
            },
            max: 4,
            labels: {
                useHTML: true,
                animate: true,
                format: '{chart.options.cats.(value)}<br>' +
                    '<span class="f32">' +
                    '<span style="display:inline-block;height:32px;vertical-align:text-top;" ' +
                    'class="flag {value}"></span></span>',
                style: {
                    textAlign: 'center'
                }
            }
        },
        yAxis: [{
            title: {
                text: 'Population Count'
            },
            showFirstLabel: false
        }],
        series: [{
            color: 'rgba(158, 159, 163, 0.5)',
            pointPlacement: -0.2,
            linkedTo: 'main',
            data: estimated,
            name: 'Estimated Population'
        }, {
            name: 'Registered Population',
            id: 'main',
            dataSorting: {
                enabled: true,
                matchByName: true
            },
            dataLabels: [{
                enabled: true,
                inside: true,
                style: {
                    fontSize: '16px'
                }
            }],
            data: rgstd
        }],
        exporting: {
            allowHTML: true
        }
    });
}
const HouseHoldsServedbyCountyChart = (charData, orglevel) => {

    Highcharts.chart('HouseHoldsServedbyCountyChart', {
        chart: {
            type: 'pie'
        },
        credits: {
            enabled: false,
        },
        title: {
            text: `Households Served by ${orglevel}`,
            align: 'left'
        },
        subtitle: {
            text: orglevel,
            align: 'left'
        },
        tooltip: {
            pointFormat: '{point.name}: <b>{point.y}</b>'
        },
        accessibility: {
            point: {
                valueSuffix: '%'
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                borderWidth: 2,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b><br>{point.percentage:.1f}%',
                    distance: 20
                }
            }
        },
        series: [{
            // Disable mouse tracking on load, enable after custom animation
            enableMouseTracking: false,
            animation: {
                duration: 2000
            },
            colorByPoint: true,
            data: charData,
        }]
    });

}
</script>
<style scoped>
/* Make charts responsive */
.highcharts-figure {
    margin: 0;
}

/* Responsive styles for mobile screens */
@media only screen and (max-width: 600px) {
    .highcharts-figure {
        width: 100%;
    }
}

#NetsDistributedwithTime,
#HouseholdsRegisteredbyCountyChart,
#HouseHoldsServedbyCountyChart,
#NetsIssuedbyCountyChart,
#netsReqvsIssuedChart,
#householdRegvsServedChart {
    max-width: 100%;
}

#netsReqvsIssuedChart .highcharts-legend {
    display: none;
    /* Hide legend for this chart on small screens */
}

#householdRegvsServedChart .highcharts-legend {
    display: none;
    /* Hide legend for this chart on small screens */
}

.stat-span {
    white-space: nowrap;
    font-size: 1.1rem;
}

.stat-title {
    font-size: 1.6rem;
    font-weight: bold;
}

.stat-card {
    background: #ebedec;
    border: solid;
    border-color: #24daa3;
    color: #4b4d4c
}

.icon-color-white {
    color: white;
}

.chart-container {
    margin: 10px;
    /* Adjust the margin as needed to create space between charts */
}

/* Additional styles for better responsiveness */
.chart-container {
    width: 100%;
}

.nested-table {
    width: 100%;
    border-collapse: collapse;
}

.nested-table td {
    padding: 0.75rem;
    border: 1px solid #dee2e6;
}

.table {
    width: 100%;
    margin-bottom: 1rem;
    color: #212529;
    border-collapse: collapse;
    /* Add this line to collapse table borders */
}

.table th,
.table td {
    padding: 0.75rem;
    vertical-align: top;
    border: 1px solid #dee2e6;
    /* Add this line for cell borders */
}

.table thead th {
    vertical-align: bottom;
    border-bottom: 2px solid #dee2e6;
}

.table tbody+tbody {
    border-top: 2px solid #ffffff;
}

.table .table {
    background-color: #fff;
}

.table-bordered th,
.table-bordered td {
    border: 1px solid #dee2e6;
}

.table-bordered thead th,
.table-bordered thead td {
    border-bottom-width: 2px;
}

.table-striped tbody tr:nth-of-type(odd) {
    background-color: rgba(255, 255, 255, 0.05);
}


@media screen and (max-width: 400px) {
    .stat-span {
        white-space: wrap;
    }
}

/* Media queries for smaller screens */
@media screen and (max-width: 767px) {
    .chart-container {
        /* Adjust any additional styles for smaller screens */
    }
}</style>
