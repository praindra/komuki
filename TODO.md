# TODO: Enhance Reservation History Feature (Riwayat Reservasi)

## Backend
- [ ] Update GET /api/users/reservations to support:
  - Pagination (page, limit)
  - Filtering by date range (startDate, endDate)
  - Filtering by reservation status (pending, completed, cancelled)
- [ ] Add new route and controller method in userRoutes.js and userController.js to:
  - Allow authenticated user to cancel their own reservation securely

## Frontend
- [ ] Add filtering controls in ReservationHistory.jsx for:
  - Date range selector (start and end date)
  - Status dropdown filter (pending, completed, cancelled)
- [ ] Add pagination controls in ReservationHistory.jsx (next/prev or page numbers)
- [ ] Add cancel button on each reservation entry with:
  - Confirmation modal/prompt
  - Cancel API request to user's cancel endpoint
  - UI update to reflect cancellation and feedback messages
- [ ] Handle loading and error states for filtering, pagination, and cancellation

## Testing
- [ ] Test backend API enhancements with various query params
- [ ] Test frontend UI for filtering, pagination, and cancellation
- [ ] Verify end-to-end workflow and UI/UX consistency
