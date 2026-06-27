## Vehicle Scheduler Backend

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
  isRead: 1
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
ON notifications(student_id; is_read, created_at DESC);

This index helps the database quickly locate unread notifications for a student and sort them efficiently.

SQL Query for Placement Notifications (Last 7 Days)

sql
SELECT id
       message,
       created_at
FROM notifications
WHERE type = 'Placement'
  AND created_at >= NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;


Additional Improvements

If the application grows further, I would also

- Use pagination for loading notifications
- Archive old notifications that are no longer needed.
- Cache frequently accessed data using Redis.
- Monitor slow queries and optimize them regularly.



Stage 4 - Performance Improvements

Possible Performance Issues

As the number of users and notifications increases, the system may face the following challenges:

- Slower database queries due to a large amount of data.
- Increased server load during peak hours.
- Delay in delivering notifications to users.
- Higher response time if all notifications are fetched at once.



Performance Improvements
1. Pagination

Instead of loading all notifications, return them in smaller batches.

Example:


GET /notifications?page=1&limit=20


This reduces the response size and improves API performance.

2. Database Indexing

Create indexes on frequently searched fields such as:

- studentId
- isRead
- createdAt

This helps retrieve notifications much faster.

3. Caching

Frequently accessed data, such as unread notifications, can be cached using Redis.

This reduces the number of database queries and improves response time.

4. Background Processing

Sending notifications should happen in the background instead of during the API request.

This allows the user to receive a faster response while the notification is processed asynchronously.

5. Load Balancing

If the application receives a large number of requests, multiple server instances can be deployed behind a load balancer.

This distributes traffic evenly and improves reliability.

Monitoring

To monitor application performance, I would track:

- API response time
- Database query execution time
- Server CPU and memory usage
- Error rate
- Number of notifications processed

Regular monitoring helps identify performance issues early and improves the overall user experience.

Stage 5 - System Design

High-Level Architecture

The notification system consists of the following components

- Client Application (Web/Mobile)
- Express.js Backend API
- MongoDB Database
- Notification Service
- WebSocket (Socket.IO) for real-time notifications

Flow

1. The client sends a request to the Express server
2. The server stores or retrieves notification data from MongoDB.
3. If a new notification is created, the server saves it in the database
4. The notification is immediately sent to connected users using Socket.IO.
5. Users can mark notifications as read or delete them through the API.

API Endpoints

| Method | Endpoint | Description |

| GET | /notifications | Get all notifications |

| POST | /notifications | Create a new notification |

| PATCH | /notifications/:id/read | Mark a notification as read |

| DELETE | /notifications/:id | Delete a notification |

Security

To secure the application, I would:

- Use JWT authenication for protected APIs.
- Validate all incoming request data.
- Restrict unauthorized access to notification endpoints.
- Store sensitive information in environment variables.

Scalability

If the application grows, I would improve it by:

- Running multiple Express server instances behind a load balancer.
- Using Redis for caching frequently accessed data.
- Moving notification processing to backgrond jobs.
- Scaling MongoDB using replication or sharding if required.

Conclusion

This design keeps the application simple, easy to maintain, and scalable. It supports real-time notifications, efficient data storage, and can handle increasing users with additional caching and load balancing.