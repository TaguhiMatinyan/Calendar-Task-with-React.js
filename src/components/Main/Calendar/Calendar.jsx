import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import Popup from 'reactjs-popup';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { v4 as uuid } from 'uuid';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'reactjs-popup/dist/index.css';
import "react-datepicker/dist/react-datepicker.css";
import './Calendar.css';

const localizer = momentLocalizer(moment);
const Calendarr = () => {
  const getInitialData = () => {
    const savedItem = localStorage.getItem("events");
    return savedItem ? JSON.parse(savedItem) : [];
  }
  const [allEvents, setAllEvents] = useState(getInitialData());
  const [editedEvent, setEditedEvent] = useState(null);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [slot, setSlot] = useState(new Date());
  const handleDateClick = (date) => {
    setEditedEvent({
      start: date,
      end: moment(date).add(1, "hour").toDate(),
      title: ""
    })
    setSlot(date)
    setPopupOpen(true);
  };
  const handleEditEvent = (event) => {
    setEditedEvent(event);
    setPopupOpen(true);
  };
  const handleUpdateEvent = (updatedEvent) => {
    const updatedEvents = allEvents.map((event) => {
      if (event.id === updatedEvent.id) {
        event.title = updatedEvent.title
        event.start = updatedEvent.start
        event.end = updatedEvent.end
        console.log("updated")
      }
      return event;
    }
    );
    setAllEvents(updatedEvents);
    setPopupOpen(false);
    setEditedEvent(null);
  };
  useEffect(() => {
    console.log("effect", allEvents)
    updateStorage()
  }, [allEvents])

  const handleDeleteEvent = (id) => {
    const updatedEvents = allEvents.filter((event) => event.id !== id);
    setAllEvents(updatedEvents);
    setPopupOpen(false);
    setEditedEvent(null);
  };
  const handleClosePopup = () => {
    setPopupOpen(false);
    setEditedEvent(null);
  };
  const updateStorage = () => {
    localStorage.setItem("events", JSON.stringify(allEvents));
  }
  function handleAddEvent() {
    editedEvent.id = uuid();
    setAllEvents(prev => [...prev, editedEvent]);
    setPopupOpen(false);
    setEditedEvent(null);
  };
  return (
    <div className='calendar'>
      <Calendar
        localizer={localizer}
        events={allEvents}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={({ start }) => handleDateClick(start)}
        onSelectEvent={(event) => handleEditEvent(event)}
      />
      <Popup open={isPopupOpen} onClose={handleClosePopup}>
        <div className='popup'>
          <button onClick={handleClosePopup}>X</button>
          <h4>{editedEvent ? 'Add, Edit or Delete' : 'Add Event'}</h4>
          <input
            className='title'
            placeholder='Event Title'
            type="text"
            value={editedEvent ? editedEvent.title : ''}
            onChange={(e) => setEditedEvent({ ...editedEvent, title: e.target.value })}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs} >
            <TimePicker className='time' label="Start time picker" defaultValue={dayjs(slot)
            } selected={editedEvent?.start || ''}
              onChange={(start) => setEditedEvent({ ...editedEvent, start })}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs} >
            <TimePicker className='time' label="End time picker" defaultValue={dayjs(slot)
            } selected={editedEvent?.end || ''}
              onChange={(end) => setEditedEvent({ ...editedEvent, end })}
            />
          </LocalizationProvider>
          <span className='btn'>
            <button
              onClick={handleAddEvent}>
              Add
            </button>
            <button value={editedEvent?.title || ''}
              onClick={() => (handleUpdateEvent(editedEvent))}>Update
            </button>
            {editedEvent && (
              <button onClick={() => handleDeleteEvent(editedEvent.id)}>Delete Event</button>
            )}</span>
        </div>
      </Popup>
    </div>
  );
};
export default Calendarr;


