const express = require('express');
const pool = require('../modules/pool');

const router = express.Router();

router.post('/', async (req, res) => {
    const { user_id, event_title, start_date, end_date, start_time, end_time, duration, location, description, is_public, notes, tasks } = req.body;

    if (!user_id || !event_title || !start_date || !start_time || !location) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const query = `
            INSERT INTO "events" 
            ("owner_id", "event_title", "start_date", "end_date", "start_time", "end_time", "duration", "location", "description", "is_public", "total_likes")
            VALUES 
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, DEFAULT)
            RETURNING id;
        `;
        const values = [
            user_id,
            event_title,
            start_date,
            end_date,
            start_time,
            end_time,
            duration,
            location,
            description,
            is_public ?? false, // Default to false if not provided
        ];

        const result = await pool.query(query, values);
        const eventId = result.rows[0].id;

        if (tasks && tasks.length > 0) {
            const taskQuery = `
                INSERT INTO "tasks_events" ("event_id", "task")
                VALUES ($1, $2);
            `;
            for (let task of tasks.split('\n')) {
                const trimmedTask = task.trim();
                if (trimmedTask) {
                    await pool.query(taskQuery, [eventId, trimmedTask]);
                }
            }
        }

        if (notes && notes.length > 0) {
            const noteQuery = `
                INSERT INTO "notes_events" ("event_id", "note")
                VALUES ($1, $2);
            `;
            for (let note of notes.split('\n')) {
                const trimmedNote = note.trim();
                if (trimmedNote) {
                    await pool.query(noteQuery, [eventId, trimmedNote]);
                }
            }
        }

        res.status(201).json({ message: 'Event created successfully', eventId });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ error: 'Failed to create event' });
    }
});

router.get('/:user_id', async (req, res) => {
    try {
        const userId = req.params.user_id;
        const query = 'SELECT * FROM "events" WHERE "owner_id" = $1;';
        const result = await pool.query(query, [userId]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error in GET /:user_id:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.delete('/:id', async (req, res) => {
    const eventId = req.params.id;
    
    try {
      const query = 'DELETE FROM "events" WHERE "id" = $1 RETURNING *';
      const result = await pool.query(query, [eventId]);
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Event not found' });
      }
  
      res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
      console.error('Error deleting event:', error);
      res.status(500).json({ error: 'Failed to delete event' });
    }
  });

router.put('/:id/like', async (req, res) => {
  const eventId = req.params.id;
  
  try {
    const query = `
      UPDATE "events" 
      SET "total_likes" = "total_likes" + 1 
      WHERE "id" = $1 
      RETURNING *
    `;
    const result = await pool.query(query, [eventId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating likes:', error);
    res.status(500).json({ error: 'Failed to update likes' });
  }
});

// Get details for a specific event
router.get('/details/:id', async (req, res) => {
    try {
        const eventId = req.params.id;
        const query = `
            SELECT e.*, 
                   array_agg(DISTINCT t.task) FILTER (WHERE t.task IS NOT NULL) as tasks,
                   array_agg(DISTINCT n.note) FILTER (WHERE n.note IS NOT NULL) as notes
            FROM "events" e
            LEFT JOIN "tasks_events" t ON e.id = t.event_id
            LEFT JOIN "notes_events" n ON e.id = n.event_id
            WHERE e.id = $1
            GROUP BY e.id;
        `;
        const result = await pool.query(query, [eventId]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }
        
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching event details:', error);
        res.status(500).json({ error: 'Failed to fetch event details' });
    }
});

module.exports = router;
