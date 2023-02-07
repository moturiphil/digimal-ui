"use strict";(self["webpackChunkMassNetCampaign"]=self["webpackChunkMassNetCampaign"]||[]).push([[2915],{22915:function(e,t,r){r.r(t),r.d(t,{AddEventWrap:function(){return d},Aside:function(){return a},BlockViewCalendarWrapper:function(){return l},CalendarWrapper:function(){return i},UpdatePopup:function(){return n}});var o=r(23481);const a=o.ZP.aside`
    @media only screen and (max-width: 1199px){
        max-width: 370px;
        margin: 0 auto;
    }
    .btn-create{
        height: 50px;
        font-size: 14px;
        font-weight: 500;
        width: 100%;
        border-radius: 8px;
        box-shadow: 0 3px 5px #FF69A505;
        margin-bottom: 25px;
    }
    .ant-picker{
        visibility: hidden;
    }
    .ant-picker .ant-picker-input{
        display: none;
    }
    .listHeader{
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 18px;
        .add-label{
            color: ${({theme:e})=>e["light-color"]};
        }
    }

    .event-list{
        li{
            &:not(:last-child){
                margin-bottom: 14px;
            }
            a{
                font-size: 14px;
                font-weight: 400;
                display: block;
                color: ${({theme:e})=>e["gray-color"]};
            }
        }
    }

`,i=o.ZP.div`
    .calendar-display{
        .vc-container{
            border: 0 none;
            .vc-header{
                padding-top: 20px;
                .vc-title{
                    font-size: 16px;
                }
            }
            .vc-weeks{
                padding: 15px 15px 25px;
            }
            .vc-arrows-container{
                padding: 20px 20px 8px;
                svg{
                    width: 8px;
                    color: ${({theme:e})=>e["gray-color"]};
                }
                .vc-arrow{
                    &:hover{
                        background-color: transparent;
                    }
                }
            }
            .vc-day.is-not-in-month *{
                color: ${({theme:e})=>e["extra-light-color"]};
                opacity: 1;
            }
            .vc-day{
                span{
                    color: ${({theme:e})=>e["gray-color"]};
                    font-weight: 400;
                }
                &.is-today{
                    span{
                        background: ${({theme:e})=>e["primary-color"]};
                        color: #fff;
                    }
                }
            }
        }
    }

    .react-calendar{
        font-family: 'Inter', sans-serif;
        width: 100%;
        border-radius: 10px;
        padding: 24px 35px;
        border: 0 none;
        background-color: #fff;
        box-shadow: 0 5px 20px ${({theme:e})=>e["light-color"]}03;
        @media only screen and (max-width: 575px){
            padding: 15px;
        }
        .react-calendar__viewContainer{
            .react-calendar__year-view__months__month {
                &:hover{
                    background-color: transparent;
                }
                &.react-calendar__tile--hasActive{
                    background-color: transparent;
                    color: ${({theme:e})=>e["primary-color"]}
                }
            }
        }
    }
    .react-calendar__navigation{
        margin-bottom: .5rem;
        button{
            &:hover,
            &:focus{
                background-color: #fff !important;
            }
        }
        .react-calendar__navigation__arrow{
            font-size: 20px;
            min-width: auto;
            color: ${({theme:e})=>e["light-color"]};
        }
        .react-calendar__navigation__label{
            font-size: 16px;
            font-weight: 500;
            color: ${({theme:e})=>e["dark-color"]};
        }
    }
    .react-calendar__month-view__weekdays{
        .react-calendar__month-view__weekdays__weekday{
            abbr{
                font-size: 13px;
                font-weight: 500;
                text-decoration: none;
                color: ${({theme:e})=>e["light-color"]};
                @media only screen and (max-width: 1300px){
                    font-size: 11px;
                  }
            }
        }
    }
    .react-calendar__month-view__days{
        .react-calendar__tile{
            max-width: 43px !important;
            padding: 1em 0.5em;
            &:hover{
                background-color: transparent;
                font-weight: 500;
                color: ${({theme:e})=>e["dark-color"]};
            }
            &.react-calendar__month-view__days__day--neighboringMonth{
                abbr{
                    color: ${({theme:e})=>e["extra-light-color"]};
                }
            }
            abbr{
                font-size: 14px;
                color: ${({theme:e})=>e["gray-color"]};
            }
            &.react-calendar__tile--now{
                padding: 0.929em 0.5em;
                background-color: transparent;
                border-radius: 50%;
                border: 1px solid ${({theme:e})=>e["primary-color"]};
            }
            &.react-calendar__tile--active{
                border-radius: 50%;
                background-color: ${({theme:e})=>e["primary-color"]};
                abbr{
                    color: #fff;
                }
            }
        }
    }
    .calendar-header{
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 25px;
        @media only screen and (max-width: 1599px){
            flex-flow: column;
        }
        .calendar-header__left{
            display: flex;
            align-items: center;
            position: relative;
            .react-calendar__viewContainer{
                min-width: 320px;
                border-radius: 8px;
                padding: 15px !important;
                border: 0 none !important;
                box-shadow: rgba(82, 63, 105, 0.15) 0px 15px 40px 0px !important;
                @media only screen and (max-width: 479px){
                    min-width: 280px;
                }
            }
            @media only screen and (max-width: 1599px){
                margin-bottom: 20px;
            }
            @media only screen and (max-width: 479px){
                flex-flow: column;
            }
            .btn-today{
                font-size: 13px;
                font-weight: 500;
                height: 34px;
                color: ${({theme:e})=>e["gray-color"]};
                border-color: ${({theme:e})=>e["border-color-light"]};
                background: transparent !important;
                @media only screen and (max-width: 479px){
                    margin-bottom: 15px;
                }
            }
            .btn-navigate{
                background: transparent !important;
            }
            .year-select{
                .ant-select-selector{
                    border: 0 none;
                    .ant-select-selection-search{
                        input{
                            height: 35px;
                        }
                    }
                    .ant-select-selection-item{
                        font-size: 16px;
                        font-weight: 500;
                        color: ${({theme:e})=>e["dark-color"]};
                    }
                }
                .ant-select-arrow{
                    right: 18px;
                    ${({theme:e})=>e.rtl?"left":"right"}: 18px;
                }
            }
            .react-calendar{
                ${({theme:e})=>e.rtl?"margin-right":"margin-left"}: 30px;
                padding: 0;
                border: none;
                .react-calendar__navigation{
                    align-items: center;
                    margin: 0;
                    border: none;
                    .react-calendar__navigation__label{
                        padding: 0 20px;
                    }
                    .react-calendar__navigation__arrow {
                        border: 1px solid ${({theme:e})=>e["border-color-light"]};
                        border-radius: 5px;
                        width: 34px;
                        height: 34px;
                        svg,
                        img{
                            width: 14px;
                        }
                    }
                }
                .react-calendar__viewContainer{
                    position: absolute;
                    background: #fff;
                    z-index: 999;
                    border: 1px solid #ddd;
                    display: none;
                    &.show{
                        display: block;
                    }
                    .react-calendar__month-view__days{
                        /* display: none !important; */
                    }
                }
            }
            .calender-head__navigation{
                display: flex;
                align-items: center;
                ${({theme:e})=>e.rtl?"margin-right":"margin-left"}: 30px;
                @media only screen and (max-width: 479px){
                    ${({theme:e})=>e.rtl?"margin-right":"margin-left"}: 0px;
                }
                .btn-navigate{
                    width: 34px;
                    height: 34px;
                    padding: 0;
                    i,
                    svg{
                        color: ${({theme:e})=>e["light-color"]};
                        margin-right: 0;
                    }
                }
                .date-label{
                    display: inline-block;
                    margin: 0 20px;
                    font-size: 16px;
                    font-weight: 500;
                    color: ${({theme:e})=>e["dark-color"]};
                    a{
                        color: ${({theme:e})=>e["dark-color"]};
                    }
                    .ant-select-selector{
                        display: flex;
                        align-items: center;
                        padding: 0;
                    }
                }
            }
        }
        .calendar-header__right{
            display: flex;
            @media only screen and (max-width: 479px){
                flex-flow: column;
                align-items: center;
            }
            svg{
                width: 14px;
            }
            ul{
                li{
                    display: inline-block;
                    &:first-child{
                        ${({theme:e})=>e.rtl?"border-right":"border-left"}: 1px solid ${({theme:e})=>e["border-color-light"]};
                    }
                    &:not(:first-child){
                        a{
                            ${({theme:e})=>e.rtl?"border-top-right-radius":"border-top-left-radius"}: 0px;
                            ${({theme:e})=>e.rtl?"border-bottom-right-radius":"border-bottom-left-radius"}: 0px;
                        }
                    }
                    &:not(:last-child){
                        a{
                            ${({theme:e})=>e.rtl?"border-top-left-radius":"border-top-right-radius"}: 0px;
                            ${({theme:e})=>e.rtl?"border-bottom-left-radius":"border-bottom-right-radius"}: 0px;
                        }
                    }
                    a{
                        font-size: 13px;
                        font-weight: 500;
                        color: ${({theme:e})=>e["light-color"]};
                        border: 1px solid ${({theme:e})=>e["border-color-light"]};
                        ${({theme:e})=>e.rtl?"border-right":"border-left"}: 0px;
                        display: block;
                        border-radius: 4px;
                        padding: 6px 13.24px;
                        &.active{
                            color: #fff;
                            border-color: ${({theme:e})=>e["primary-color"]};
                            background-color: ${({theme:e})=>e["primary-color"]};
                        }
                    }
                }
            }
            .schedule-list{
                margin-left: 20px;
                ${({theme:e})=>e.rtl?"margin-right":"margin-left"}: 20px;
                display: flex;
                align-items: center;
                color: ${({theme:e})=>e["light-color"]};
                @media only screen and (max-width: 479px){
                    margin: 15px 0 0 0;
                }
                svg,
                img,
                i{
                    margin-right: 6px;
                    ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 6px;
                    color: ${({theme:e})=>e["primary-color"]};
                }
                &.active{
                    color: ${({theme:e})=>e["primary-color"]};
                }
            }
        }
    }

    .table-event{

        border: 1px solid ${({theme:e})=>e["border-color-light"]};
        &.table-responsive{
            @media only screen and (max-width: 1599px){
                display: block;
                width: 100%;
                overflow-x: auto;
            }
        }
        tr{
            th,
            td{
                padding: 16px 0;
                border-bottom: 1px solid ${({theme:e})=>e["border-color-light"]};
                &:first-child{
                    min-width: 75px;
                    padding: 16px 18px 16px 18px;
                    ${({theme:e})=>e.rtl?"border-left":"border-right"}: 1px solid ${({theme:e})=>e["border-color-light"]};

                }
            }
        }
        thead{
            th{
                padding: 0 22px;
                background-color: ${({theme:e})=>e["bg-color-light"]};
                p{
                    font-size: 14px;
                    font-weight: 500;
                    margin-bottom: 0;
                }
            }
        }
        tbody{
            td{
                padding: 0 10px;
                font-size: 12px;
                min-width: 140px;
                color: ${({theme:e})=>e["light-color"]};
                .currentTime{
                    width: calc(100% + 20px);
                    height: 1px;
                    display: block;
                    position: relative;
                    ${({theme:e})=>e.rtl?"right":"left"}: -10px;
                    z-index: 222;
                    &:after{
                        position: absolute;
                        left: 0;
                        ${({theme:e})=>e.rtl?"right":"left"}: 0px;
                        top: -6px;
                        width: 12px;
                        height: 12px;
                        border-radius: 50%;
                        content: '';
                        background-color: ${({theme:e})=>e["secondary-color"]};
                    }
                }
                .day-event-item{
                    width: 100%;
                    display: block;
                    border-radius: 3px 6px 6px 3px;
                    padding: 6px 12px !important;
                    margin: 2px 0 !important;
                    position: relative;
                    &:after{
                        position: absolute;
                        left: 0;
                        ${({theme:e})=>e.rtl?"right":"left"}: 0px;
                        bottom: 0;
                        width: 2px;
                        height: 100%;
                        border-radius: 6px 0 0 6px;
                        content: '';
                    }
                    &.primary{
                        background-color: #EFEFFE;
                        color: ${({theme:e})=>e["primary-color"]};
                        &:hover{
                            color: ${({theme:e})=>e["primary-color"]};
                        }
                        &:after{
                            background-color: ${({theme:e})=>e["primary-color"]};
                        }
                    }
                    &.secondary{
                        background-color: #FFF0F6;
                        color: ${({theme:e})=>e["secondary-color"]};
                        &:hover{
                            color: ${({theme:e})=>e["secondary-color"]};
                        }
                        &:after{
                            background-color: ${({theme:e})=>e["secondary-color"]};
                        }
                    }
                    &.success{
                        background-color: #E8FAF4;
                        color: ${({theme:e})=>e["success-color"]};
                        &:after{
                            background-color: ${({theme:e})=>e["success-color"]};
                        }
                    }
                    &.warning{
                        background-color: #FFF3E6;
                        color: ${({theme:e})=>e["warning-color"]};
                        &:after{
                            background-color: ${({theme:e})=>e["warning-color"]};
                        }
                    }
                    &.info{
                        background-color: ${({theme:e})=>e["info-color"]}10;
                        color: ${({theme:e})=>e["info-color"]};
                        &:after{
                            background-color: ${({theme:e})=>e["info-color"]};
                        }
                    }
                    .event-title{
                        display: block;
                        font-size: 13px;
                        font-weight: 500;
                        margin-bottom: 4px;
                    }
                }
            }

        }
    }

    .emptyData{
        min-height: 110px;
        font-size: 18px;
        align-items: center;
        justify-content: center;
        color: ${({theme:e})=>e["light-color"]};
        display: flex;
    }

    .event-week{
        tr{
            th,
            td{
                &:not(:last-child){
                    ${({theme:e})=>e.rtl?"border-left":"border-right"}: 1px solid ${({theme:e})=>e["border-color-light"]};
                }
            }
        }
        thead{
            tr{
                th{
                    text-align: center;
                    .week-dayName{
                        font-size: 13px;
                        font-weight: 400;
                        margin-bottom: 2px;
                        color: ${({theme:e})=>e["light-color"]};
                    }
                    .week-date{
                        display: inline-block;
                        line-height: 1.45;
                        border-radius: 9px;
                        font-size: 13px;
                        &.primary{
                            padding: 0 10px;
                        }
                    }
                }
            }
        }
        tbody{
            .ant-dropdown-trigger{
                display: inline-block;
            }
        }
    }

    .schedule-event{
        tr{
            &:hover{
                box-shadow: 0 15px 40px ${({theme:e})=>e["light-color"]}15;
                td{
                    border-color: #fff;
                }
            }
            td{
                padding: 10px 20px !important;
                vertical-align: top;
                font-size: 14px;
                &:first-child{
                    ${({theme:e})=>e.rtl?"border-left":"border-right"}: 0 none;
                }
                &.schedule-time{
                    direction: ltr;
                    min-width: 100px;
                    width: 130px;
                }
                .ant-row{
                    &:not(:last-child){
                        margin-bottom: 10px;
                    }
                }
                .schedule-date{
                    font-weight: 500;
                    color: ${({theme:e})=>e["dark-color"]};
                }
                .schedule-date-name{
                    margin-left: 10px;
                }
                .event-title{
                    font-weight: 500;
                    color: ${({theme:e})=>e["dark-color"]};
                    @media only screen and (max-width: 575px){
                        display: inline-block;
                        margin-top: 6px;
                    }
                }
                .schedule-time{
                    font-size: 13px;
                    color: ${({theme:e})=>e["light-color"]};
                }
            }
        }
    }

    .events{
        li{
            position: relative;
            height: 35px;
            a{
                position: absolute;
                top: 0;
                left: 0;
                ${({theme:e})=>e.rtl?"right":"left"}: 0;
                padding: 5px 12px;
                z-index: 1;
                border-radius: 4px;
                font-size: 13px;
                &:hover{
                    color: #fff;
                }
            }
        }
    }

    .ant-picker-calendar-full .ant-picker-panel .ant-picker-calendar-date-content {
        overflow-y: unset;
    }

`,n=o.ZP.div`
    .ant-card{
        width: 320px !important;
        .ant-card-body{
            padding: 0 !important;

            .headerUpdate{
                border-radius: 8px 8px 0 0;
                padding: 13px 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                h4{
                    font-size: 16px;
                    font-weight: 500;
                    color: #fff;
                    margin-bottom: 0;
                }
                .action{
                    display: flex;
                    align-items: center;
                    width: 100px;
                    justify-content: flex-end;
                    color: #fff;
                    a{
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        min-width: 36px;
                        height: 36px;
                        border-radius: 50%;
                        background-color: transparent;
                        padding: 0;
                        color: #fff;
                        transition: .3s;
                        &:hover{
                            background-color: #F4F5F715;
                        }
                        svg{
                            margin: 0;
                        }
                    }
                }
            }
            .bodyUpdate{
                padding: 20px;
                .event-info{
                    display: flex;
                    align-items: flex-start;
                    color: ${({theme:e})=>e["gray-color"]};
                    &:last-child{
                        margin-bottom: 0;
                    }
                    strong{
                        margin-left: 6px;
                        ${({theme:e})=>e.rtl?"margin-right":"margin-left"}: 6px;
                        font-weight: 500;
                        color: ${({theme:e})=>e["dark-color"]};
                    }
                    svg,
                    i{
                        color: ${({theme:e})=>e["light-color"]};
                    }
                    svg,
                    i,
                    img{
                        margin: ${({theme:e})=>e.rtl?"4px 0 0 12px":"4px 12px 0 0"};
                    }
                    label{
                        font-size: 13px;
                        color: ${({theme:e})=>e["light-color"]};
                    }
                }
            }
        }
    }
`,l=o.ZP.div`
    &.table-responsive{
        table{
            @media only screen and (max-width: 1599px){
                display: block;
                width: 100%;
                overflow-x: auto;
            }
        }
    }
    .ant-fullcalendar{
        border: 1px solid ${({theme:e})=>e["border-color-light"]};
        .ant-fullcalendar-calendar-body{
            padding: 0 !important;
        }
        .ant-picker-calendar-date {
            padding-top: 10px;
            margin: 0 !important;
            border-top: 0 none !important;
        }
        .ant-fullcalendar-cell,
        .ant-fullcalendar-month-panel-cell{
            min-width: 155px;
            padding: 0;
            ${({theme:e})=>e.rtl?"border-left":"border-right"}: 1px solid ${({theme:e})=>e["border-color-light"]};
            .ant-picker-cell-inner{
                min-width: 155px;
            }
            &:hover{
                .ant-fullcalendar-date{
                    background-color: transparent !important;
                }
            }
            &.ant-fullcalendar-today{
                .ant-fullcalendar-date{
                    background-color: #EFEFFE !important;
                    position: relative;
                    &:after{
                        position: absolute;
                        left: 0;
                        ${({theme:e})=>e.rtl?"right":"left"}: 0;
                        top: 0;
                        height: 2px;
                        width: 100%;
                        content: '';
                        background-color: ${({theme:e})=>e["primary-color"]};
                    }
                }
            }
            &.ant-fullcalendar-selected-day{
                .ant-fullcalendar-date{
                    background-color: transparent;
                }
            }
            &.ant-picker-cell-in-view{
                .ant-picker-calendar-date{
                    color: ${({theme:e})=>e["gray-color"]};
                }
            }
            .ant-picker-calendar-date{
                color: ${({theme:e})=>e["extra-light-color"]};
            }
            .ant-picker-calendar-date-value{
                margin: 6px 4px 10px 0
            }
            .ant-fullcalendar-date, .ant-fullcalendar-month{
                border-top:0;
                margin: 0;
            }
        }
        table{
            thead{
                tr{
                    th{
                        padding: 16px 20px !important;
                        background-color: ${({theme:e})=>e["bg-color-light"]} !important;
                        color: ${({theme:e})=>e["gray-color"]};;
                    }
                }
            }
            tr{
                &:last-child{
                    td{
                        border-bottom: 0 none;
                    }
                }
                th,
                td{
                    ${({theme:e})=>e.rtl?"border-left":"border-right"}: 0;
                    border-bottom: 1px solid ${({theme:e})=>e["border-color-light"]};
                    &:last-child{
                        border-right: 0 none;
                        ${({theme:e})=>e.rtl?"border-left":"border-right"}: 0 none;
                    }
                }
            }
        }
    }
`,d=o.ZP.div`
    label{
        font-weight: 400 !important;
        color: ${({theme:e})=>e["light-color"]} !important;
        margin-bottom: 0 !important;
    }
    .ant-form-item{
        span.label{
            @media only screen and (max-width: 575px){
                display: inline-block;
                margin-bottom: 10px;
            }
        }
    }
    .date-time-picker{
        margin: -5px;
        flex-wrap: wrap;
    }
    .ant-calendar-picker{
        padding: 5px;
        flex: 0 0 50%;
    }
    .ant-time-picker{
        width: auto;
        padding: 5px;
        flex: 0 0 50%;
        .ant-time-picker-input{
            width: 100%;
            height: 48px;
        }
    }
    .ant-form-item-control-input{
        min-height: 46px;
        textarea{
            min-height: 104px;
            resize: none;
        }
        .ant-input{
            border: 1px solid ${({theme:e})=>e["border-color-light"]};
            &::placeholder{
                color: ${({theme:e})=>e["gray-color"]};
            }
        }
    }
    .ant-row{
        flex-flow: row !important;
        align-items: center;
        @media only screen and (max-width: 575px){
            flex-flow: column !important;
            align-items: flex-start;
        }
        &.event-desc{
            align-items: flex-start;
        }
        .ant-form-item-control{
            @media only screen and (max-width: 575px){
                width: 100%;
            }
        }
    }

    .date-time-picker {
        .ant-picker{
            min-width: auto;
            width: 100%;
            &:not(:last-child){
                ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 10px;
            }
        }
        .ant-picker-input{
            padding: 0 30px;
            position: relative;
            @media only screen and (max-width: 575px){
                padding: 0 20px 0 25px;
            }
            .ant-picker-suffix{
                position: absolute;
                ${({theme:e})=>e.rtl?"right":"left"}: 0;
                top: 50%;
                transform: translateY(-50%);
                @media only screen and (max-width: 575px){
                    ${({theme:e})=>e.rtl?"right":"left"}: 0;
                }
                svg{
                    color: ${({theme:e})=>e["light-color"]};
                }
            }
        }
    }
    .add-event-footer{
        .ant-btn-white{
            color: ${({theme:e})=>e["light-color"]} !important;
        }
        .btn-save{
            height: 38px;
            padding: 0 25px;
        }
    }
`}}]);
//# sourceMappingURL=2915.66dee15d.js.map