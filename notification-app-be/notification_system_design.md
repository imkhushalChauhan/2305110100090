Notification System Design

Stage 1

REST APIs

1. Get Notifications

GET /notifications

Headers

Authorization: Bearer <token>

Response

json = >
{
  "notifications": [
    {
      "id": "uuid",
      "type": "Placement",
      "message": "Google is hiring",
      "isRead": false,
      "createdAt": "2026-06-26T10:30:00"
    }
  ]
}


2. Mark Notification as Read

PATCH /notifications/:id/read

Headers

Authorization: Bearer <token>

Response

json = >
{
  "message": "Notification marked as read"
}


3. Mark All as Read

PATCH /notifications/read-all

Response

json = >
{
  "message": "All notifications marked as read"
}


4. Delete Notification

DELETE /notifications/:id

Response

json = >
{
  "message": "Notification deleted"
}

5. Real-time Notifications

Use {WebSockets (Socket.IO)} to push notifications instantly to connected users.

Advantages:

- Low latency
- Real-time updates
- Reduced server load

Stage 2

Database Selection

For this project, I would use **MongoDB** because I already have experience working with it in Node.js applications.

Why MongoDB?

- Stores data as JSON-like documents, making it easy to work with JavaScript.
- Flexible schema allows adding new notification fields without changing the database structure.
- Good performance for large numbers of notifications.
- Easy to scale horizontally if the number of users increases.


Collection Design

students

json
{
  "_id": "studentId",
  "name": "Khushal Chauhan",
  "email": "khushal@example.com"
}


notifications

json
{
  "_id": "notificationId",
  "studentId": "studentId",
  "type": "Placement",
  "message": "CSX Corporation hiring",
  "isRead": false,
  "createdAt": "2026-06-26T12:30:00Z"
}

One student can have multiple notifications.

Problems as Data Grows

If millions of notifications are stored:

- Searching can become slower.
- Reading all notifications at once increases response time.
- Storage usage keeps increasing.


Solutions

- Create indexes on {studentId, isRead, and createdAt}.
- Use pagination to load notifications in small batches.
- Archive old notifications after a certain period.
- Cache frequently accessed unread notifications using Redis if required.


Example Queries

Get unread notifications:

javascript
db.notifications.find({
  studentId: "1042",
  isRead: false
}).sort({ createdAt: -1 })


Mark as read:

javascript
db.notifications.updateOne(
  { _id: "notificationId" },
  { $set: { isRead: true } }
)


Delete notification:

javascript
db.notifications.deleteOne({
  _id: "notificationId"
})


Index

javascript
db.notifications.createIndex({
  studentId: 1,
  isRead: 1,
  createdAt: -1
})


This index helps retrieve unread notifications quickly for a specific student.


Stage 3 - Query Optimization

Issues in the Given Query

The original query may become slow when the notifications table contains a large number of records because:

- It has to scan many rows before filtering.
- Without proper indexes, searching by s{tudent_id and is_read} takes more time.
- Sorting by {created_at} can also slow down the query.


Optimized Query

sql
SELECT id, message, type, created_at
FROM notifications
WHERE student_id = ?
  AND is_read = FALSE
ORDER BY created_at DESC
LIMIT 20;


Why is this better?

- Retrieves only the required columns instead of using {SELECT *}.
- Uses {LIMIT} to return only the latest 20 notifications.
- Orders results by newest notifications first.
- Reduces the amount of data transferred from the database.



Recommended Index

sql
CREATE INDEX idx_notifications_student_read_date
ON notifications(student_id, is_read, created_at DESC);

This index helps the database quickly locate unread notifications for a student and sort them efficiently.

SQL Query for Placement Notifications (Last 7 Days)

sql
SELECT id,
       message,
       created_at
FROM notifications
WHERE type = 'Placement'
  AND created_at >= NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;


Additional Improvements

If the application grows further, I would also:

- Use pagination for loading notifications.
- Archive old notifications that are no longer needed.
- Cache frequently accessed data using Redis.
- Monitor slow queries and optimize them regularly.