<template>
  <Main>
    <sdPageHeader :title="`Bales Verified at ${post_name}`">
      <br />
      <template #subTitle>
        <sdButton
          class="btn-add_new"
          size="extra-small"
          type="success"
          @click="openModal(post_id)"
        >
          Verify Bale
        </sdButton>
      </template>
    </sdPageHeader>
    <a-row :gutter="15">
      <a-col class="w-100" :md="24">
        <sdCards headless>
          <div v-if="isLoading" class="spin">
            <a-spin />
          </div>

          <div v-else>
            <TableWrapper class="table-data-view table-responsive">
              <a-table
                :pagination="{ pageSize: 100, showSizeChanger: true }"
                :dataSource="dataSource"
                :columns="columns"
              >
                <template #bale="{ record }">
                  <td>
                    <div class="table-actions">
                      <sdButton
                        class="button-container"
                        size="extra-small"
                        type="danger"
                        @click="openModal(record.verification_id)"
                      >
                        Void
                      </sdButton>
                    </div>
                  </td>
                </template>
              </a-table>
            </TableWrapper>
          </div>
          <!-- Void Bale Verification Modal -->
          <a-modal
            title="Void Bale Verification"
            :visible="isModalOpen"
            @cancel="handleCancel"
            width="20%"
          >
            <p>Are you sure you want to void bale verified?</p>
            <template #footer>
              <a-button key="cancel" type="warning" @click="handleCancel">
                Cancel
              </a-button>
              <a-button key="confirm" type="danger" @click="handleVoid">
                Confirm
              </a-button>
            </template>
          </a-modal>
          <!-- End Void Bale Verification Modal -->
        </sdCards>
      </a-col>
    </a-row>
  </Main>
</template>
<script>
// import { RecordFormWrapper } from "../style";
import { Main } from "../../styled";
import { useStore } from "vuex";
import { reactive, ref, defineComponent, computed, onMounted } from "vue";
// import axios from "axios";
import { notification } from "ant-design-vue";
import authHeader from "../../../services/auth-header";
// import { useRouter } from "vue-router";
import * as Yup from "yup";
import { useRoute } from "vue-router";

const dateFormat = "YYYY-MM-DD";

const columns = [
  {
    title: "Batch No.",
    dataIndex: "bale_batch_no",
    key: "id",
  },
  {
    title: "Expected No of Nets",
    dataIndex: "expected_no_of_nets",
    key: "id",
  },
  {
    title: "Counted No of Nets",
    dataIndex: "counted_no_of_nets",
    key: "id",
  },
  {
    title: "Variance",
    dataIndex: "variance",
    key: "id",
  },
  {
    title: "Verified By",
    dataIndex: "verified_by",
    key: "id",
  },
  {
    title: "Verification Time",
    dataIndex: "timestamp",
    key: "id",
  },
  {
    title: "Action",
    dataIndex: "",
    key: "bale",
    slots: { customRender: "bale" },
  },
];

const AddNew = defineComponent({
  name: "AddNew",
  components: { Main },
  data() {
    const { state } = useStore();
    const isLoading = computed(() => state.crud.loading);
    const apiUrl = computed(() => state.crud.url);
    const isFileLoading = computed(() => state.crud.fileLoading);
    const join = ref("");
    const dataSource = ref([]);
    const API_URL = `${process.env.VUE_APP_BASE_URL}/bale_verification`;
    // const router = useRouter();

    const { query } = useRoute();
    const post_id = Number(query.id);
    const post_name = query.name;
    console.log(query.id);
    // const d_no = query.delivery_no;

    const isModalOpen = ref(false);
    const handleOk = async () => (isModalOpen.value = false);
    const handleCancel = () => (isModalOpen.value = false);
    const openmodal = () => (isModalOpen.value = true);

    const openModal = (id) => {
      console.log(id);
      isModalOpen.value = true;
    };

    const formState = reactive({
      post_id: post_id,
      bale_batch_no: "",
      counted_no_of_nets: "",
      expected_no_of_nets: "",
      // date_received: date_received,
      delivery_note_number: "N/A",
      // received_by: received_by,
    });

    const { loading, isFacility, delivery_notes } = reactive({
      loading: true,
      isFacility: false,
      delivery_notes: [],
    });

    const ArticleSchema = Yup.object().shape({
      bale_batch_no: Yup.string().required("Batch no is required"),
      counted_no_of_nets: Yup.number().required(
        "Counted no of nets is required"
      ),
      expected_no_of_nets: Yup.number().required(
        "Expected no of nets is required"
      ),
      // date_received: Yup.string().required("Date received is required"),
      delivery_note_number: Yup.string().required(
        "Delivery note no/s11 is required"
      ),
      // received_by: Yup.string().required("Received by is required"),
    });

    const validate = (field) => {
      ArticleSchema.validateAt(field, formState)
        .then(() => (this.errors[field] = ""))
        .catch((err) => {
          this.errors[err.path] = err.message;
        });
    };

    //delivery_note_number
    const getDeliveryNotes = async () => {
      const response = await fetch(
        `${process.env.VUE_APP_BASE_URL}/bale_verification_delivery note?post_id=${post_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...authHeader(),
          },
        }
      );
      const data = await response.json();
      this.delivery_notes = data.data;
      console.log(this.delivery_note);
      this.loading = false;
    };
    getDeliveryNotes();

    onMounted(async () => {
      try {
        const response = await fetch(
          `${process.env.VUE_APP_BASE_URL}/bale_verified?post_id=${post_id}`,
          {
            method: "GET",
            headers: authHeader(),
          }
        );
        const data = await response.json();
        dataSource.value = data.data;
        console.log(dataSource.value);
      } catch (error) {
        console.error(error);
      }
    });
    console.log(formState.isFacility);
    const handleSubmit = async () => {
      const values = {
        post_id: post_id,
        bale_batch_no: formState.bale_batch_no,
        counted_no_of_nets: formState.counted_no_of_nets,
        expected_no_of_nets: formState.expected_no_of_nets,
        delivery_note_number: "N/A",
      };

      console.log(JSON.stringify(values));

      try {
        // Validate the form
        await ArticleSchema.validate(formState, { abortEarly: false });

        // If validation is successful, proceed with the API call
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...authHeader(),
          },
          body: JSON.stringify(values),
        });

        const data = await response.json();

        console.log(data);

        if (data.success) {
          // Handle success
          notification["success"]({
            message: "Nets Verified",
            description: "Nets have been successfully verified",
            duration: 5.5,
          });
          // router.push("/nets/nets-delivered");
        } else {
          // Handle failure
          notification["error"]({
            message: "Error",
            description: data.message,
            duration: 5.5,
          });
        }
      } catch (error) {
        // Handle validation errors or other exceptions
        console.error("Error:", error);
        notification.error({
          message: "Error",
          description: error.message,
          duration: 5.5,
        });
      }
    };

    const handleVoid = async () => {
      try {
        const response = await fetch(
          `${process.env.VUE_APP_BASE_URL}/bale_verification_void?bale_verification_id=${"hehe"}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...authHeader(),
            },
          }
        );
        const data = await response.json();
        console.log(data);

        if (data.status === true) {
          notification.success({
            message: "Participant voided successfully",
            description: data.message,
          });
          await new Promise((resolve) => {
            setTimeout(resolve, 2000);
          });
          location.reload();
        } else {
          notification.error({
            message: "Participant voiding not successful",
            description: data.message,
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    return {
      isLoading,
      loading,
      apiUrl,
      isFileLoading,
      isFacility,
      handleSubmit,
      dateFormat,
      formState,
      join,
      validate,
      columns,
      dataSource,
      errors: {
        bale_batch_no: "",
        counted_no_of_nets: "",
        expected_no_of_nets: "",
        date_received: "",
        delivery_note_number: "",
        received_by: "",
      },
      delivery_notes,
      post_name,
      isModalOpen,
      openmodal,
      openModal,
      handleOk,
      handleCancel,
      handleVoid,
    };
  },
});

export default AddNew;
</script>
