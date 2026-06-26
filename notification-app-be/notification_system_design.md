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

```javascript
db.notifications.createIndex({
  studentId: 1,
  isRead: 1,
  createdAt: -1
})
```

This index helps retrieve unread notifications quickly for a specific student.