<template>
    <RecordViewWrapper>
        <sdPageHeader title="Approve">
        </sdPageHeader>
        <sdPageBody>
            <Main>
                <div class="flex-container">

                    <h3>{{ query.file_name}}</h3> |
                    <h3 :style="{'background-color': query.status == 'Pending' ? '#FFBF00' : '#50C878' }" class="status">{{ query.status}}</h3> |
                    <sdButton
                    size="small"
                    type="success"
                    @click="approve"
                    :hidden="query.status == 'Approved'"
                    >
                    Approve
                    &nbsp; 
                    </sdButton>
                </div>
                <br/> 
                <br/>
                <a-modal
                    title="Master List Approval"
                    :visible="isModalOpen"
                    centered
                    @ok="handleOk(recordId, inputValue)"
                    @cancel="handleCancel"
                    class="title-success"
                    okText="Submit"
                >
                    <div>
                    <p>By submitting this I confirm that the information provided in this master list is accurate and verified based on the 2023 LLIN policy guideline</p>
                    <!-- <input type="text" v-model="inputValue" /> -->
                    </div>
                </a-modal>
                <a-row :gutter="16">
                    <a-col class="w-100" :md="24">
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
    import { useRoute } from "vue-router";
    import { notification } from "ant-design-vue";

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
        const isModalOpen = ref(false);

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
        const approve = ()=>{
            isModalOpen.value = true;
        }
        const handleCancel = () => {
            isModalOpen.value = false;
        };
        const handleOk = async () => {
            try {
                const response = await fetch(
                `${process.env.VUE_APP_BASE_URL}/approve-master-list/${params.id}`,
                {
                    method: "POST",
                    headers: authHeader(),
                    body: null

                }
                );
                const data = await response.json();
                if (data.success == true) {
                    notification.success({
                    message: "Success",
                    description: data.message,
                    });
                    window.location.reload();
                } else {
                    notification.error({
                    message: "Error",
                    description: data.message,
                    });
                }
            } catch (error) {
                console.error(error);
            }
            isModalOpen.value = false;
        };

        return {
            approve,
            isModalOpen,
            handleOk,
            handleCancel,
            query,
            dataSource,
            columns,
            errors:[]
        }
       }
    })
    
    export default excelReview;
    
    </script>

    <style>
       
    .flex-container {
        display: flex;
        align-items: center; 
        gap: 10px; 
        }
        .status {
            padding: 5px 10px; 
            border-radius: 5px; 
            color: white; 
        }
    </style>