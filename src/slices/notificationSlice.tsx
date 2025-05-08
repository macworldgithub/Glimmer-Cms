// notificationSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getNotification, markAllNotificationsAsReadAPI, markNotificationAsReadAPI } from "../api/auth/api";

interface Notification {
    id: string;
    message: string;
    timestamp: string;
    read: boolean;
    data?: any;
}

interface NotificationState {
    notifications: Notification[];
}

const initialState: NotificationState = {
    notifications: [],
};

const notificationSlice = createSlice({
    name: "Notifications",
    initialState,
    reducers: {
        addNotification(state, action: PayloadAction<Notification>) {
            state.notifications.unshift(action.payload);
        },
        markAsRead(state, action: PayloadAction<string>) {
            const notification = state.notifications.find(n => n.id === action.payload);
            if (notification) notification.read = true;
        },
        markAllAsRead(state) {
            state.notifications.forEach(n => (n.read = true));
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getNotification.fulfilled, (state, action) => {
            const fetched = action.payload || [];
            // Normalize notifications if needed
            state.notifications = fetched.map((item: any) => ({
                id: item._id,
                message: item.message,
                timestamp: item.createdAt || new Date().toISOString(),
                read: item.read,
                data: item.data || null,
            }));
        })
            .addCase(markNotificationAsReadAPI.fulfilled, (state, action) => {
                const notification = state.notifications.find(n => n.id === action.payload);
                if (notification) notification.read = true;
            })
            .addCase(markAllNotificationsAsReadAPI.fulfilled, (state) => {
                state.notifications.forEach(n => (n.read = true));
            });
    },
});

export const { addNotification, markAsRead, markAllAsRead } =
    notificationSlice.actions;

export default notificationSlice.reducer;
