import { useState, useEffect } from 'react';
import { notificationService } from '../../services/notificationService';
import Pagination from '../../components/Public/Pagination';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { userService } from '../../services/userService';
import LoadingSpinner from '../../components/Public/LoadingSpinner';
import { useNotification } from '../../components/Notification/NotificationContext';

// Enable fromNow()
dayjs.extend(relativeTime);

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showNotification } = useNotification();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const me = await userService.getMe();
      const userId = me.id;
      const response = await notificationService.getByUserId(userId);

      if (response) {
        setNotifications(response);
        setUnreadCount(response.filter(n => !n.notificationRead).length);
      }
    } catch {
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev =>
        prev.map(n =>
          n.notificationId === id
            ? { ...n, notificationRead: true }
            : n
        )
      );
      setUnreadCount(prev => prev - 1);
    } catch {
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead(); // Call the API to mark all as read
      setNotifications(prev => prev.map(n => ({ ...n, notificationRead: true })));
      setUnreadCount(0);
      showNotification('Done', 'success');
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };
  

  const deleteNotification = async (id) => {
    try {
      await notificationService.delete(id);
      setNotifications(prev => prev.filter(n => n.notificationId !== id));
      showNotification('Notification deleted', 'success');
    } catch (error) {
      console.error("Failed to delete notification:", error);
      showNotification('Failed to delete notification', 'error');
    }
  };
  const formatDate = dateString => dayjs(dateString).fromNow();

  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'LIKE':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        );
      case 'FOLLOW':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <line x1="20" y1="8" x2="20" y2="14" />
            <line x1="23" y1="11" x2="17" y2="11" />
          </svg>
        );
      case 'COMMENT':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        );
    }
  };

  // Sort notifications: unread first, then by date
  const sortedNotifications = [...notifications].sort((a, b) => {
    // First sort by read status
    if (!a.notificationRead && b.notificationRead) return -1;
    if (a.notificationRead && !b.notificationRead) return 1;
    
    // Then sort by date (newest first)
    return new Date(b.notificationCreatedAt) - new Date(a.notificationCreatedAt);
  });
  
  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentNotifications = sortedNotifications.slice(indexOfFirst, indexOfLast);

  if (loading) {
    return <LoadingSpinner size="50px" color="#e74c3c" />
  }

  if (error) {
    return (
      <div className="react-course-filter back__course__page_grid pb---40 pt---110">
        <div className="container pb---70">
          <div className="alert alert-danger">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="notification-container">
      <div className="notification-header">
        <div className="header-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <h2>Notifications</h2>
          {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
        </div>
        <button onClick={markAllAsRead} className="mark-all-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          Mark All as Read
        </button>
      </div>

      <h6>Total Messages({notifications.length})</h6>

      <div className="notification-list">
        {loading ? (
          <div className="loading-state">Loading notifications...</div>
        ) : error ? (
          <div className="error-state">{error}</div>
        ) : notifications.length === 0 ? (
          <div className="empty-state">No notifications yet</div>
        ) : (
          currentNotifications.map(notification => (
            <div
              key={notification.notificationId}
              className={`notification-item ${notification.notificationRead ? 'read' : 'unread'}`}
            >
              <div className="notification-content">
                <div className={`icon-container ${notification.notificationType.toLowerCase()}`}>
                  {getNotificationIcon(notification.notificationType)}
                </div>
                <div className="notification-message">
                  <p>
                    <span className="user-name">{notification.userName}</span>
                    {notification.notificationContent}
                  </p>
                  <span className="notification-time">{formatDate(notification.notificationCreatedAt)}</span>
                </div>
              </div>

              <div className="notification-actions">
                {!notification.notificationRead && (
                  <button
                    onClick={() => markAsRead(notification.notificationId)}
                    className="mark-read-button"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Mark read
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(notification.notificationId)}
                  className="delete-button1"
                  title="Delete notification"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {!loading && !error && (
        <div className="pagination-container" style={{ marginTop: '40px' }}>
          <Pagination
            currentPage={currentPage}
            totalItems={notifications.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default NotificationList;