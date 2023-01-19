<template>
  <a-menu
    v-model:openKeys="openKeys"
    v-model:selectedKeys="selectedKeys"
    :mode="mode"
    :theme="darkMode ? 'dark' : 'light'"
  >
    <!-- <a-sub-menu key="dashboard">
      <template v-slot:title>
        <sdFeatherIcons type="home" /><span>Dashboard</span>
      </template>
      <a-menu-item @click="toggleCollapsed" key="home">
        <router-link to="/"> Social Media </router-link>
      </a-menu-item>
      <a-menu-item @click="toggleCollapsed" key="business">
        <router-link to="/business"> Fintech / Business </router-link>
      </a-menu-item>
      <a-menu-item @click="toggleCollapsed" key="performance">
        <router-link to="/performance"> Site Performance </router-link>
      </a-menu-item>
      <a-menu-item @click="toggleCollapsed" key="eco">
        <router-link to="/eco"> Ecommerce </router-link>
      </a-menu-item>
      <a-menu-item @click="toggleCollapsed" key="crm">
        <router-link to="/crm"> CRM </router-link>
      </a-menu-item>
      <a-menu-item @click="toggleCollapsed" key="sales">
        <router-link to="/sales"> Sales Performance </router-link>
      </a-menu-item>
    </a-sub-menu>

    <a-sub-menu key="layout">
      <template v-slot:title
        ><sdFeatherIcons type="layout" /><span>Layout</span></template
      >
      <a-menu-item @click="toggleCollapsed" key="light">
        <a
          @click="
            (e) => {
              e.preventDefault();
              toggleCollapsed();
              modeChangeLight();
            }
          "
          to="#"
        >
          Light Mode
        </a>
      </a-menu-item>
      <a-menu-item @click="toggleCollapsed" key="dark">
        <a
          @click="
            (e) => {
              e.preventDefault();
              toggleCollapsed();
              modeChangeDark();
            }
          "
          to="#"
        >
          Dark Mode
        </a>
      </a-menu-item>
      <a-menu-item @click="toggleCollapsed" key="topMenu">
        <a
          @click="
            (e) => {
              e.preventDefault();
              toggleCollapsed();
              modeChangeTopNav();
            }
          "
          to="#"
        >
          Top Menu
        </a>
      </a-menu-item>
      <a-menu-item @click="toggleCollapsed" key="sideMenu">
        <a
          @click="
            (e) => {
              e.preventDefault();
              toggleCollapsed();
              modeChangeSideNav();
            }
          "
          to="#"
        >
          Side Menu
        </a>
      </a-menu-item>
      <a-menu-item @click="toggleCollapsed" key="rtl">
        <a
          @click="
            (e) => {
              e.preventDefault();
              toggleCollapsed();
              onRtlChange();
            }
          "
          to="#"
        >
          RTL
        </a>
      </a-menu-item>
      <a-menu-item @click="toggleCollapsed" key="ltr">
        <a
          @click="
            (e) => {
              e.preventDefault();
              toggleCollapsed();
              onLtrChange();
            }
          "
          to="#"
        >
          LTR
        </a>
      </a-menu-item>
    </a-sub-menu>

    <a-menu-item @click="toggleCollapsed" key="changelog">
      <router-link to="/changelog">
        <sdFeatherIcons type="activity" />
        <span>
          Changelog
          <span class="badge badge-primary menuItem">{{
            versions[0].version
          }}</span>
        </span>
      </router-link>
    </a-menu-item>

    <a-menu-item-group key="crud">
      <template v-slot:title>
        <p class="sidebar-nav-title">CRUD</p>
      </template>

      <a-sub-menu key="axios">
        <template v-slot:title
          ><sdFeatherIcons type="database" /><span>Axios</span></template
        >
        <a-menu-item @click="toggleCollapsed" key="axios-view">
          <router-link to="/crud/axios-view"> View All </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="axios-add">
          <router-link to="/crud/axios-add"> Add New </router-link>
        </a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="fireStore">
        <template v-slot:title
          ><sdFeatherIcons type="database" /><span>FireStore</span></template
        >
        <a-menu-item @click="toggleCollapsed" key="fireStore-view">
          <router-link to="/crud/fireStore-view"> View All </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="fireStore-add">
          <router-link to="/crud/fireStore-add"> Add New </router-link>
        </a-menu-item>
      </a-sub-menu>
    </a-menu-item-group>

    <a-menu-item-group key="applications">
      <template v-slot:title>
        <p class="sidebar-nav-title">APPLICATIONS</p>
      </template>

      <a-sub-menu key="mail">
        <template v-slot:title
          ><sdFeatherIcons type="mail" /><span>Email</span></template
        >
        <a-menu-item @click="toggleCollapsed" key="inbox">
          <router-link to="/app/mail/inbox"> Inbox </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="singleMail">
          <router-link to="/app/mail-single/1585118055048">
            Read Email
          </router-link>
        </a-menu-item>
      </a-sub-menu>

      <a-sub-menu key="chat">
        <template v-slot:title
          ><sdFeatherIcons type="message-square" /><span>Chat</span></template
        >
        <a-menu-item @click="toggleCollapsed" key="privateSingle">
          <router-link to="/app/chat/private/rofiq@gmail.com">
            Private
          </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="groupSingle">
          <router-link to="/app/chat/group/1"> Group </router-link>
        </a-menu-item>

        <a-menu-item @click="toggleCollapsed" key="allSingle">
          <router-link to="/app/chat/all/rofiq@gmail.com"> All </router-link>
        </a-menu-item>
      </a-sub-menu>

      <a-sub-menu key="ecommerce">
        <template v-slot:title
          ><sdFeatherIcons type="shopping-cart" /><span
            >eCommerce</span
          ></template
        >
        <a-menu-item @click="toggleCollapsed" key="ecommerce-product">
          <router-link to="/app/ecommerce/product/grid"> Products </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="detail">
          <router-link to="/app/ecommerce/productDetails/5">
            Product Detail
          </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="add-product">
          <router-link to="/app/ecommerce/add-product">
            Product Add
          </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="edit-product">
          <router-link to="/app/ecommerce/edit-product">
            Product Update
          </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="orders">
          <router-link to="/app/ecommerce/orders"> Orders </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="sellers">
          <router-link to="/app/ecommerce/sellers"> Sellers </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="invoice">
          <router-link to="/app/ecommerce/invoice"> Invoice </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="cart">
          <router-link to="/app/ecommerce/cart"> Cart </router-link>
        </a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="social">
        <template v-slot:title
          ><sdFeatherIcons type="aperture" /><span>Social App</span></template
        >
        <a-menu-item @click="toggleCollapsed" key="overview">
          <router-link to="/app/social/profile/overview">
            My Profile
          </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="timeline">
          <router-link to="/app/social/profile/timeline">
            Timeline
          </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="activity">
          <router-link to="/app/social/profile/activity">
            Activity
          </router-link>
        </a-menu-item>
      </a-sub-menu>

      <a-sub-menu key="project">
        <template v-slot:title
          ><sdFeatherIcons type="target" /><span>Projects</span></template
        >
        <a-menu-item @click="toggleCollapsed" key="grid">
          <router-link to="/app/project/grid"> Project Grid </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="list">
          <router-link to="/app/project/list"> Project List </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="createProject">
          <router-link to="/app/createProject/create-grid">
            Project Create
          </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="projectDetails">
          <router-link to="/app/project/projectDetails/1">
            Project Details
          </router-link>
        </a-menu-item>
      </a-sub-menu>

      <a-sub-menu key="calendar">
        <template v-slot:title
          ><sdFeatherIcons type="calendar" /><span>Calender</span></template
        >
        <a-menu-item @click="toggleCollapsed" key="month">
          <router-link to="/app/calendar/month"> Month </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="year">
          <router-link to="/app/calendar/year"> Year </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="day">
          <router-link to="/app/calendar/day"> Day </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="schedule">
          <router-link to="/app/calendar/schedule"> Schedule </router-link>
        </a-menu-item>
      </a-sub-menu>

      <a-sub-menu key="users">
        <template v-slot:title
          ><sdFeatherIcons type="users" /><span>Users</span></template
        >
        <a-menu-item @click="toggleCollapsed" key="team">
          <router-link to="/app/users/team"> Team </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="user-grid">
          <router-link to="/app/users/users/user-grid">
            Users Grid
          </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="user-list">
          <router-link to="/app/users/users/user-list">
            Users List
          </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="grid-style">
          <router-link to="/app/users/users/grid-style">
            Users Grid Style
          </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="grid-group">
          <router-link to="/app/users/users/grid-group">
            Users Grid Group
          </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="add-user">
          <router-link to="/app/users/add-user/info"> Add Users </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="dataTable">
          <router-link to="/app/users/dataTable"> Users table </router-link>
        </a-menu-item>
      </a-sub-menu>

      <a-sub-menu key="contact">
        <template v-slot:title
          ><sdFeatherIcons type="user-plus" /><span>Contacts</span></template
        >
        <a-menu-item @click="toggleCollapsed" key="contact-grid">
          <router-link to="/app/contact/contact-grid">
            Contacts Grid
          </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="contact-list">
          <router-link to="/app/contact/contact-list">
            Contacts List
          </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="contact-create">
          <router-link to="/app/contact/contact-create">
            Create Contact
          </router-link>
        </a-menu-item>
      </a-sub-menu>

      <a-sub-menu key="note">
        <template v-slot:title
          ><sdFeatherIcons type="file-text" /><span>Note</span></template
        >
        <a-menu-item @click="toggleCollapsed" key="note-all">
          <router-link to="/app/note/all"> All </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="note-favorite">
          <router-link to="/app/note/favorite"> Favorite </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="note-personal">
          <router-link to="/app/note/personal"> Personal </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="note-work">
          <router-link to="/app/note/work"> Work </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="social-note">
          <router-link to="/app/note/social"> Social </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="note-important">
          <router-link to="/app/note/important"> Important </router-link>
        </a-menu-item>
      </a-sub-menu>

      <a-menu-item @click="toggleCollapsed" key="to-do">
        <router-link to="/app/to-do">
          <sdFeatherIcons type="check-square" />
          <span> To Do </span>
        </router-link>
      </a-menu-item>

      <a-menu-item @click="toggleCollapsed" key="kanban">
        <router-link to="/app/kanban">
          <sdFeatherIcons type="columns" />
          <span> Kanban Board </span>
        </router-link>
      </a-menu-item>

      <a-sub-menu key="import-export">
        <template v-slot:title
          ><sdFeatherIcons type="repeat" /><span>Import Export</span></template
        >
        <a-menu-item @click="toggleCollapsed" key="import">
          <router-link to="/app/import"> Import </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="export">
          <router-link to="/app/export"> Export </router-link>
        </a-menu-item>
      </a-sub-menu>

      <a-sub-menu key="task">
        <template v-slot:title
          ><sdFeatherIcons type="file" /><span>Task</span></template
        >
        <a-menu-item @click="toggleCollapsed" key="all">
          <router-link to="/app/task/all"> All </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="favorites">
          <router-link to="/app/task/favorites"> Favorites </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="completed">
          <router-link to="/app/task/completed"> Completed </router-link>
        </a-menu-item>
      </a-sub-menu>
    </a-menu-item-group> -->

    <!-- <a-menu-item-group key="features">
      <template v-slot:title>
        <p class="sidebar-nav-title">FEATURES</p>
      </template>
      <a-sub-menu key="components">
        <template v-slot:title
          ><sdFeatherIcons type="layers" /><span>UI Elements</span></template
        >
        <a-menu-item @click="toggleCollapsed" key="alerts">
          <router-link to="/components/alerts"> Alerts </router-link>
        </a-menu-item>

        <a-menu-item @click="toggleCollapsed" key="avatar">
          <router-link to="/components/avatar"> Avatar </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="badge">
          <router-link to="/components/badge"> Badge </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="breadcrumb">
          <router-link to="/components/breadcrumb"> Breadcrumb </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="button">
          <router-link to="/components/button"> Buttons </router-link>
        </a-menu-item>

        <a-menu-item @click="toggleCollapsed" key="calendar">
          <router-link to="/components/calendar"> Calendar </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="cards">
          <router-link to="/components/cards"> Cards </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="carousel">
          <router-link to="/components/carousel"> Carousel </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="cascader">
          <router-link to="/components/cascader"> Cascader </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="checkbox">
          <router-link to="/components/checkbox"> Checkbox </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="collapse">
          <router-link to="/components/collapse"> Collapse </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="comments">
          <router-link to="/components/comments"> Comments </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="dash-base">
          <router-link to="/components/dash-base"> Dashboard Base </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="datePicker">
          <router-link to="/components/datePicker"> DatePicker </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="drag">
          <router-link to="/components/drag-drop"> Drag & Drop </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="drawer">
          <router-link to="/components/drawer"> Drawer </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="dropdown">
          <router-link to="/components/dropdown"> Dropdown </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="empty">
          <router-link to="/components/empty"> Empty </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="grids">
          <router-link to="/components/grid"> Grid </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="input">
          <router-link to="/components/input"> Input </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="list">
          <router-link to="/components/list"> List </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="menu">
          <router-link to="/components/menu"> Menu </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="message">
          <router-link to="/components/message"> Message </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="modal">
          <router-link to="/components/modal"> Modal </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="notification">
          <router-link to="/components/notification">
            Notification
          </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="pageHeader">
          <router-link to="/components/pageHeader"> PageHeader </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="pagination">
          <router-link to="/components/pagination"> Pagination </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="popConfirm">
          <router-link to="/components/popConfirm"> PopConfirm </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="popover">
          <router-link to="/components/popover"> Popover </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="progressbar">
          <router-link to="/components/progressbar"> Progress Bar </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="radio">
          <router-link to="/components/radio"> Radio </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="rate">
          <router-link to="/components/rate"> Rate </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="result">
          <router-link to="/components/result"> Result </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="select">
          <router-link to="/components/select"> Select </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="skeleton">
          <router-link to="/components/skeleton"> Skeleton </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="slider">
          <router-link to="/components/slider"> Slider </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="spiner">
          <router-link to="/components/spiner"> Spiner </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="statistic">
          <router-link to="/components/statistic"> Statistic </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="steps">
          <router-link to="/components/steps"> Steps </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="switch">
          <router-link to="/components/switch"> Switch </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="tabs">
          <router-link to="/components/tabs"> Tabs </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="tags">
          <router-link to="/components/tags"> Tags </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="timeline">
          <router-link to="/components/timeline"> Timeline </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="time-picker">
          <router-link to="/components/time-picker"> TimePicker </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="tree-select">
          <router-link to="/components/tree-select"> Tree Select </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="upload">
          <router-link to="/components/upload"> Upload </router-link>
        </a-menu-item>
      </a-sub-menu>

      <a-sub-menu key="charts">
        <template v-slot:title
          ><sdFeatherIcons type="bar-chart-2" /><span>Charts</span></template
        >
        <a-menu-item @click="toggleCollapsed" key="chart-js">
          <router-link to="/chart/chart-js"> Chart js </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="googleChart">
          <router-link to="/chart/google-chart"> Google Chart </router-link>
        </a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="apexchart">
        <template v-slot:title
          ><sdFeatherIcons type="bar-chart" /><span>Apex Charts</span></template
        >
        <a-menu-item @click="toggleCollapsed" key="columnChart">
          <router-link to="/apexchart/column-chart">
            Column Charts
          </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="lineChart">
          <router-link to="/apexchart/line-chart"> Line Charts </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="areaChart">
          <router-link to="/apexchart/area-chart"> Area Charts </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="barChart">
          <router-link to="/apexchart/bar-chart"> Bar Charts </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="pieChart">
          <router-link to="/apexchart/pie-chart"> Pie Charts </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="radialbarChart">
          <router-link to="/apexchart/radialbar-chart">
            Radialbar Charts
          </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="radarChart">
          <router-link to="/apexchart/radar-charts"> Radar Charts </router-link>
        </a-menu-item>
      </a-sub-menu>

      <a-sub-menu key="forms">
        <template v-slot:title
          ><sdFeatherIcons type="disc" /><span>Forms</span></template
        >
        <a-menu-item @click="toggleCollapsed" key="formLayout">
          <router-link to="/forms/form-layout"> Form Layout </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="formElements">
          <router-link to="/forms/form-elements"> Form Elements </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="formComponents">
          <router-link to="/forms/form-components">
            Form Components
          </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="formValidation">
          <router-link to="/forms/form-validation">
            Form Validation
          </router-link>
        </a-menu-item>
      </a-sub-menu>

      <a-sub-menu key="tables">
        <template v-slot:title
          ><sdFeatherIcons type="cpu" /><span>Table</span></template
        >
        <a-menu-item @click="toggleCollapsed" key="table">
          <router-link to="/tables/basic"> Basic Table </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="DataTable">
          <router-link to="/tables/dataTable"> Data Table </router-link>
        </a-menu-item>
      </a-sub-menu>

      <a-sub-menu key="widgets">
        <template v-slot:title
          ><sdFeatherIcons type="server" /><span>Widgets</span></template
        >
        <a-menu-item @click="toggleCollapsed" key="widgetCharts">
          <router-link to="/widgets/chart"> Charts </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="widgetsCard">
          <router-link to="/widgets/card"> Card </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="widgetMixed">
          <router-link to="/widgets/mixed"> Mixed </router-link>
        </a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="wizard">
        <template v-slot:title
          ><sdFeatherIcons type="square" /><span>Wizard</span></template
        >
        <a-menu-item @click="toggleCollapsed" key="wizard1">
          <router-link to="/wizard/wizard1"> Wizard1 </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="wizard2">
          <router-link to="/wizard/wizard2"> Wizard2 </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="wizard3">
          <router-link to="/wizard/wizard3"> Wizard3 </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="wizard4">
          <router-link to="/wizard/wizard4"> Wizard4 </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="wizard5">
          <router-link to="/wizard/wizard5"> Wizard5 </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="wizard6">
          <router-link to="/wizard/wizard6"> Wizard6 </router-link>
        </a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="icons">
        <template v-slot:title
          ><sdFeatherIcons type="grid" /><span>Icons</span></template
        >
        <a-menu-item @click="toggleCollapsed" key="featherIcons">
          <router-link to="/icons/featherIcons"> FeatherIcons </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="fa">
          <router-link to="/icons/fa"> FontAwesome Icons </router-link>
        </a-menu-item>
      </a-sub-menu>
    </a-menu-item-group>
    <a-sub-menu key="maps">
      <template v-slot:title
        ><sdFeatherIcons type="map" /><span>Maps</span></template
      >
      <a-menu-item @click="toggleCollapsed" key="google">
        <router-link to="/maps/google"> Google Maps </router-link>
      </a-menu-item>
      <a-menu-item @click="toggleCollapsed" key="leaflet">
        <router-link to="/maps/leaflet"> Leaflet </router-link>
      </a-menu-item>
      <a-menu-item @click="toggleCollapsed" key="vector">
        <router-link to="/maps/vector"> Vector </router-link>
      </a-menu-item>
    </a-sub-menu> -->
    <a-menu-item-group key="pages">
      <!-- <template v-slot:title>
        <p class="sidebar-nav-title">Pages</p>
      </template> -->
      <!-- <a-sub-menu key="settings">
        <template v-slot:title
          ><sdFeatherIcons type="settings" /><span>Settings</span></template
        >
        <a-menu-item @click="toggleCollapsed" key="profile-settings">
          <router-link to="/page/profile-settings"> Settings </router-link>
        </a-menu-item>

        <a-menu-item @click="toggleCollapsed" key="set-profile">
          <router-link to="/page/profile-settings/profile">
            Profile
          </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="set-account">
          <router-link to="/page/profile-settings/account">
            Account
          </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="set-password">
          <router-link to="/page/profile-settings/password">
            Password
          </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="set-social">
          <router-link to="/page/profile-settings/social"> Social </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="set-notification">
          <router-link to="/page/profile-settings/notification">
            Notification
          </router-link>
        </a-menu-item>
      </a-sub-menu> -->
      <a-menu-item @click="toggleCollapsed" key="gallery">
        <router-link to="/page/gallery">
          <sdFeatherIcons type="image" />
          <span> Campaign </span>
        </router-link>
      </a-menu-item>
      <a-menu-item @click="toggleCollapsed" key="pricing">
        <router-link to="/page/pricing">
          <sdFeatherIcons type="dollar-sign" />
          <span> Events </span>
        </router-link>
      </a-menu-item>
      <!-- <a-menu-item @click="toggleCollapsed" key="banners">
        <router-link to="/page/banners">
          <sdFeatherIcons type="cast" />
          <span> Banners </span>
        </router-link>
      </a-menu-item> -->
      <!-- <a-menu-item @click="toggleCollapsed" key="testimonials">
        <router-link to="/page/testimonials">
          <sdFeatherIcons type="book-open" />
          <span> Testimonials </span>
        </router-link>
      </a-menu-item>
      <a-menu-item @click="toggleCollapsed" key="faq`s">
        <router-link to="/page/faqs">
          <sdFeatherIcons type="help-circle" />
          <span> FAQs </span>
        </router-link>
      </a-menu-item>
      <a-menu-item @click="toggleCollapsed" key="search">
        <router-link to="/page/search">
          <sdFeatherIcons type="search" />
          <span> Search </span>
        </router-link>
      </a-menu-item>
      <a-menu-item @click="toggleCollapsed" key="starter">
        <router-link to="/starter">
          <sdFeatherIcons type="circle" />
          <span> Blank Page </span>
        </router-link>
      </a-menu-item>
      <a-sub-menu key="knowledgebase">
        <template v-slot:title
          ><sdFeatherIcons type="book" /><span>Knowledge Base</span></template
        >
        <a-menu-item @click="toggleCollapsed" key="base">
          <router-link to="/page/knowledgebase/base/plugins">
            Knowledge Base
          </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="all-articles">
          <router-link to="/page/knowledgebase/all-articles">
            All Articles
          </router-link>
        </a-menu-item>
        <a-menu-item @click="toggleCollapsed" key="knowledge-base-singale">
          <router-link to="/page/knowledgebase/single/1">
            Single Article
          </router-link>
        </a-menu-item>
      </a-sub-menu>
      <a-menu-item @click="toggleCollapsed" key="support">
        <router-link to="/page/support">
          <sdFeatherIcons type="headphones" />
          <span> Support Center </span>
        </router-link>
      </a-menu-item>

      <a-menu-item @click="toggleCollapsed" key="maintenance">
        <router-link to="/page/maintenance">
          <sdFeatherIcons type="airplay" />
          <span> Maintenance </span>
        </router-link>
      </a-menu-item>

      <a-menu-item @click="toggleCollapsed" key="404">
        <router-link to="/page/404">
          <sdFeatherIcons type="info" />
          <span> 404 </span>
        </router-link>
      </a-menu-item>
      <a-menu-item @click="toggleCollapsed" key="comingSoon">
        <router-link to="/page/comingSoon">
          <sdFeatherIcons type="clock" />
          <span> Coming Soon </span>
        </router-link>
      </a-menu-item> -->
    </a-menu-item-group>
  </a-menu>
</template>
<script>
import {
  computed,
  reactive,
  ref,
  toRefs,
  watch,
  watchEffect,
  defineComponent,
} from "vue";
import VueTypes from "vue-types";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import versions from "../demoData/changelog.json";

export default defineComponent({
  name: "AsideItems",
  props: {
    toggleCollapsed: VueTypes.func,
    events: VueTypes.object,
  },
  setup(props) {
    const store = useStore();
    const darkMode = computed(() => store.state.themeLayout.data);
    const mode = ref("inline");
    const { events } = toRefs(props);
    const {
      onRtlChange,
      onLtrChange,
      modeChangeDark,
      modeChangeLight,
      modeChangeTopNav,
      modeChangeSideNav,
    } = events.value;

    const router = computed(() => useRoute());
    const state = reactive({
      selectedKeys: ["home"],
      openKeys: ["dashboard"],
      preOpenKeys: ["dashboard"],
    });

    watchEffect(() => {
      if (router.value.matched.length) {
        if (router.value.matched.length > 2) {
          state.selectedKeys = [router.value.matched[2].name];
          state.openKeys = [router.value.matched[1].name];
          state.preOpenKeys = [router.value.matched[1].name];
        } else if (router.value.matched.length > 3) {
          state.selectedKeys = [router.value.matched[3].name];
          state.openKeys = [router.value.matched[1].name];
          state.preOpenKeys = [router.value.matched[1].name];
        } else {
          state.selectedKeys = [router.value.matched[1].name];
          state.openKeys = [router.value.matched[1].name];
          state.preOpenKeys = [router.value.matched[1].name];
        }
      }
    });

    watch(
      () => state.openKeys,
      (val, oldVal) => {
        state.preOpenKeys = oldVal;
      }
    );

    return {
      mode,
      ...toRefs(state),
      darkMode,
      onRtlChange,
      onLtrChange,
      modeChangeDark,
      modeChangeLight,
      modeChangeTopNav,
      modeChangeSideNav,
      versions,
    };
  },
});
</script>
