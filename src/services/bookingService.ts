
export const saveBooking = async (bookingData: any) => {
  try {
    // TODO: Replace with actual API endpoint
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      throw new Error('Failed to save booking');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}; 