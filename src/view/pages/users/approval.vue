<template>
    <RecordViewWrapper>
        <sdPageHeader title="Approve">
            <template id="buttons"></template>
        </sdPageHeader>
        <sdPageBody>
            <Main>
                <a-row :gutter="16">
                    <a-col class="w-100" :md="24">
                        <!-- <input type="file" @change="handleFile" /> -->
    
                        <!-- <div v-if="data.length > 0">
                            <table>
                                <tr v-for="(row, index) in data" :key="index">
                                <td v-for="(cell, cellIndex) in row" :key="cellIndex">
                                    {{ cell }}
                                </td>
                                </tr>
                            </table>
                        </div> -->
                        <div v-if="dataSource.length" >
    
                            <TableWrapper class="table-data-view table-responsive">
                                <a-table
                                :pagination="{ pageSize: 100, showSizeChanger: true }"
                                :dataSource="dataSource"
                                :columns="columns"
                                >
                                
                                </a-table>
                            </TableWrapper>    
                        </div>
                    </a-col>
                </a-row>
            </Main>
        </sdPageBody>
    </RecordViewWrapper>
    </template>
    <script>
    import { RecordViewWrapper } from "../style";
    import { Main, TableWrapper } from "../../styled";
    import { defineComponent, ref, onMounted } from "vue";
    import authHeader from "../../../services/auth-header";

    // import { computed, onMounted, ref, reactive, defineComponent } from "vue";

    // import * as XLSX from "xlsx";
    import { useRoute } from "vue-router";

    // import authHeader from "../../../services/auth-header";
    const excelReview = defineComponent({
        name: "ReviewExcel", 
        components: {
            RecordViewWrapper,
            Main,
            TableWrapper
        },
    
       data(){
        const dataSource = ref([]);
        const { query, params } = useRoute();

        console.log(params.id, query.id)
        const columns = [
            {
                title: "ID",
                dataIndex: "id",
                key: "id",
            },
            {
                title: "Phone number",
                dataIndex: "phone_number",
                key: "id",
            },
            {
                title: "First Name",
                dataIndex: "first_name",
                key: "id",
            },
            {
                title: "Middle Name",
                dataIndex: "middle_name",
                key: "id",
            },
            {
                title: "Last Name",
                dataIndex: "last_name",
                key: "id",
            },
            {
                title: "Level",
                dataIndex: "level",
                key: "id",
            },
            {
                title: "Job Group",
                dataIndex: "job_group",
                key: "id",
            },
            {
                title: "Organization",
                dataIndex: "organization",
                key: "id",
            },
            {
                title: "Role in Campaign",
                dataIndex: "role_in_campaign",
                key: "id",
            },
            {
                title: "Gender",
                dataIndex: "gender",
                key: "id",
            },
            {
                title: "Locatiion code",
                dataIndex: "location_code",
                key: "id",
            },
        ]
    
        onMounted(async () => {
        try {
            const response = await fetch(
            `${process.env.VUE_APP_BASE_URL}/master_list_details/${params.id}}`,
            {
                method: "GET",
                headers: authHeader(),
            }
            );
            const data = await response.json();
            dataSource.value = data.data;
            console.log(data.data);
        } catch (error) {
            console.error(error);
        }
        });

        // const handleFile = (event)=>{
        //   const file = event.target.files[0];
        //   const reader = new FileReader();
    
        //   reader.onload = (e) => {
        //     const data = new Uint8Array(e.target.result);
        //     const workbook = XLSX.read(data, { type: 'array' });
        //     const firstSheetName = workbook.SheetNames[0];
        //     const worksheet = workbook.Sheets[firstSheetName];
        //     const parsedData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        //     const passedData = XLSX.utils.sheet_to_json(worksheet);
        //     dataSource.value = passedData;
    
        //     const heads = parsedData.shift().map((item, index) => {
        //             return {
        //                     title: item,
        //                     dataIndex: item,
        //                     key: index,
        //                 }
        //             })
        //     const regex = /^(?:254|\+254)?((1|7)(?:(?:[1294][0-9])|(?:0[0-8])|(9[0-2]))[0-9]{6})$/
        //     passedData.map((item)=>{
    
        //             if((`${item['Phone No.']}`.match(regex)) == null){
        //                 return this.errors.push({ [item['ID']]: `${item['Phone No.']}` + " is not a valid phone number"});
        //             }
        //     })
    
        //     heads.push({
        //         title: "Actions",
        //         dataIndex: "actions",
        //         key: "actions",
        //         slots: { customRender: "actions" },
        //     });
        //     columns.value = heads;    
        //     // this.data = parsedData;
        //   };
    
        //   reader.readAsArrayBuffer(file);
        // }
        return {
            // data: [],
            // handleFile,
            dataSource,
            columns,
            errors:[]
        }
       }
    })
    
    export default excelReview;
    
    </script>