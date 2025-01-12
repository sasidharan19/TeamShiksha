const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Load data from data.json
const loadData = () => {
  const data = fs.readFileSync('./data.json', 'utf-8');
  return JSON.parse(data);
};

// Save data to data.json
const saveData = (data) => {
  fs.writeFileSync('./data.json', JSON.stringify(data, null, 2), 'utf-8');
};

// Get Event by Slug
app.get('/events/:slug', (req, res) => {
  const events = loadData();
  const slug = req.params.slug;
  const event = events.find((e) => e.slug === slug && !e.deleted);
  if (event) {
    res.json(event);
  } else {
    res.status(404).json({ message: 'Event not found' });
  }
});

// Search Events
app.get('/events', (req, res) => {
  const { query } = req.query;
  const events = loadData();
  const filteredEvents = events.filter(
    (e) =>
      !e.deleted &&
      (e.title.toLowerCase().includes(query?.toLowerCase() || '') ||
        e.description.toLowerCase().includes(query?.toLowerCase() || ''))
  );
  res.json(filteredEvents);
});

// Soft Delete Event
app.delete('/events/:slug', (req, res) => {
  const events = loadData();
  const slug = req.params.slug;
  const eventIndex = events.findIndex((e) => e.slug === slug);

  if (eventIndex !== -1) {
    events[eventIndex].deleted = true;
    saveData(events);
    res.json({ message: 'Event soft deleted successfully' });
  } else {
    res.status(404).json({ message: 'Event not found' });
  }
});

// Update Description
app.put('/events/:slug', (req, res) => {
  const { description } = req.body;
  const events = loadData();
  const slug = req.params.slug;
  const eventIndex = events.findIndex((e) => e.slug === slug);

  if (eventIndex !== -1) {
    events[eventIndex].description = description;
    saveData(events);
    res.json({ message: 'Description updated successfully', event: events[eventIndex] });
  } else {
    res.status(404).json({ message: 'Event not found' });
  }
});

// Server setup
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
