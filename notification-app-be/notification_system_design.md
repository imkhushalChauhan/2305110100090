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