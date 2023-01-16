import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { QUERY_EVENTS } from "../../utils/queries";
import { QUERY_SCHEDULE } from "../../utils/queries";
import { QUERY_LOCATIONS } from "../../utils/queries";
import LoadFullCalendar from "./LoadFullCalendar";
import "../../styles/calendar.css";
// import { INITIAL_EVENTS } from "../utils/event-utils"; // seed data if necessary

const FullCalendarApp = () => {
  const navigate = useNavigate();
  // set state of sctive view through day# click
  const [activeView, setActiveView] = useState("dayGridMonth");
  const [weekendsVisible] = useState(true);

  let colorArray = ["yellow", "red", "black", "green", "blue", "orange", "purple"];

  function getRandomInt(max) {

    let randomNumber = Math.floor(Math.random() * max);

    return randomNumber;
  }

  console.log(getRandomInt(6));
  console.log(colorArray[getRandomInt(colorArray.length)])

  // console.log(["yellow", "red", "black", "green", "blue", "orange", "purple"].filter(({color, index}) => index === (Math.floor(Math.random() * 6))).map(color => color).join());

  useEffect(() => {
    setActiveView("listDay");
  }, [activeView]);

  let rawEvents;
  const [INITIAL_EVENTS, setINITIAL_EVENTS] = useState(null);
  const [renderCalendar, setRenderCalendar] = useState(false);
  const previousValue = useRef(null);

  // query events
  //fix
  const { loading: eventLoad, data: eventData } = useQuery(QUERY_EVENTS);
   // eslint-disable-next-line
   const {
    // eslint-disable-next-line
    loading: scheduleLoad,
    // eslint-disable-next-line
    data: schedule,
    // eslint-disable-next-line
    error: scheduleError,
    // eslint-disable-next-line
    refetch: scheduleRefetch,
  } = useQuery(QUERY_SCHEDULE);

  //fix
  if (!eventLoad) {
    console.log(eventData)
    console.log(schedule)
  }

  const { loading: locationLoad, data: locationData } =
    useQuery(QUERY_LOCATIONS);

  let locations;
  if (!locationLoad) {
    locations = locationData.locations;
  }

  const handleEventClick = (event) => {
    let eventId = event.event._def.publicId;

    let filteredLocation = locations.filter((element) => {
      return element._id === eventId;
    });

    navigate("/location", { state: { locationInfo: filteredLocation[0] } });
    return;
  };

  let results = [];

  // if (!eventLoad) {
  //   rawEvents = eventData?.events;

  //   results = rawEvents?.map((event) => {
  //     return {
  //       id: event._id,
  //       title: event.title,
  //       startTime: event.startTime,
  //       endTime: event.endTime,
  //       daysOfWeek: event.daysOfWeek,
  //       startRecur: new Date(event.startRecur).toISOString(),
  //       display: event.display,
  //       backgroundColor: event.backgroundColor,
  //       textColor: event.textColor,
  //     };
  //   });

    if (!scheduleLoad) {
      // rawEvents = schedule?.events;
  
      results = schedule?.schedules?.map((job) => {
        return {
          id: job._id,
          title: job.client.businessName,
          // startTime: job.startTime,
          // endTime: job.endTime,
          // daysOfWeek: event.daysOfWeek,
          // // daysOfWeek: [1],
          start: new Date(job.startDate).toISOString(),
          end: new Date(job.endDate).toISOString(),
          // start: '2022-01-17 09:00:00',
          // end: '2022-01-17 09:00:00',
          // startRecur: new Date(job.startDate).toISOString(),
          // display: event.display,
          display: "block",
          // backgroundColor: event.backgroundColor,
          // backgroundColor: "yellow",
          backgroundColor: colorArray[getRandomInt(colorArray.length)],
          // textColor: event.textColor,
          textColor: "black",
        };
      });

    // prevents infinite render loop by comparing most recent returned query to previous query. if the same, terminates infinate loop
    if (
      results !== undefined &&
      previousValue.current !== undefined &&
      previousValue !== null &&
      results?.length === previousValue.current?.length
    ) {
      return (
        <>
          <LoadFullCalendar
            activeView={activeView}
            weekendsVisible={weekendsVisible}
            INITIAL_EVENTS={INITIAL_EVENTS}
            renderEventContent={renderEventContent}
            handleEventClick={handleEventClick}
          />
        </>
      );
    }

    setINITIAL_EVENTS(results);
    setRenderCalendar(true);
  }

  // creates previous result value to help eliminate re-render loop
  if (INITIAL_EVENTS) {
    previousValue.current = INITIAL_EVENTS;
  }

  // check for mobile device to set initial view
  window.mobilecheck = function () {
    var check = false;

    console.log('mobile check = ', check)
    alert(`1 mobile check ${check}`);

    (function (a) {
      if (
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
          a
        ) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(
          a.substr(0, 4)
        )
      )
        check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);


    console.log('2 mobile check = ', check)
    alert(`2 mobile check ${check}`);

    return !check;
  };

  function renderEventContent(eventInfo) {
    return (
      <>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
      </>
    );
  }

  // spinner - wait for query to return event data
  if (!renderCalendar) {
    return (
      <div className="d-flex justify-content-center">
        <div className="lds-hourglass"></div>
      </div>
    );
  } else {
    return (
      <>
        <LoadFullCalendar
          activeView={activeView}
          weekendsVisible={weekendsVisible}
          INITIAL_EVENTS={INITIAL_EVENTS}
          renderEventContent={renderEventContent}
          handleEventClick={handleEventClick}
        />
      </>
    );
  }
};

export default FullCalendarApp;
