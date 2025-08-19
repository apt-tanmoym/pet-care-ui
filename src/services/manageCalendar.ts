import http from '@/common/http';

interface CheckDayAvailabilityPayload {
  userName: string;
  userPass: string;
  deviceStat: string;
  orgId: string | undefined;
  startDate: string;
  stopDate: string;
}

interface CheckDayAvailabilityResponse {
  message: string;
  status: string;
}

interface CheckDuplicateSlotPayload {
  userName: string;
  userPass: string;
  deviceStat: string;
  orgId: number;
  facilityId: number;
  slotId: number;
  startDate: string;
  stopDate: string;
}

interface CheckDuplicateSlotResponse {
  message: string;
  status: string;
}

interface AddSlotPayload {
  userName: string;
  userPass: string;
  deviceStat: string;
  orgId: string | undefined;
  facilityId: number;
  bookAppType: string;
  checkedDay: string;
  dayTime: string;
  startDate: string;
  stopDate: string;
  slotDuration: string;
  slotDuration2: string;
  slotId?: string; // Optional for edit case
}

interface AddSlotResponse {
  message: string;
  status: string;
}

export interface GetDoctorSlotsPayload {
  userName: string;
  userPass: string;
  deviceStat: string;
  orgId: string | undefined;
  facilityId: string;
}

export interface GetDoctorSlotsResponse {
  status: string;
  message?: string;
  data?: any;
}

export const checkDayAvailability = async (payload: CheckDayAvailabilityPayload): Promise<CheckDayAvailabilityResponse> => {
  try {
    const { data } = await http.post<CheckDayAvailabilityResponse>('/checkdayavailability', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const checkDuplicateSlot = async (payload: CheckDuplicateSlotPayload): Promise<CheckDuplicateSlotResponse> => {
  try {
    const { data } = await http.post<CheckDuplicateSlotResponse>('/checkduplicateslot', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const addSlot = async (payload: AddSlotPayload): Promise<AddSlotResponse> => {
  try {
    const { data } = await http.post<AddSlotResponse>('/addslot', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getdoctorSlots = async (payload: GetDoctorSlotsPayload): Promise<GetDoctorSlotsResponse> => {
  try {
    const { data } = await http.post<GetDoctorSlotsResponse>('/getdoctorslots', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

interface GetEditSlotDataPayload {
  userName: string;
  userPass: string;
  deviceStat: string;
  slotId: number;
}

interface GetEditSlotDataResponse {
  slotDuration: string;
  slotDuration2: string;
  userName: string | null;
  userPass: string | null;
  deviceStat: string | null;
  checkedDay: string | null;
  dayTime: string | null;
  startDate: string | null;
  stopDate: string | null;
  orgStrDtTmStr: string | null;
  orgStpDtTmStr: string | null;
  facilityName: string | null;
  docName: string | null;
  patientName: string | null;
  gender: string | null;
  appointmentStatus: string | null;
  changeStatus: string | null;
  regStatus: string | null;
  eventDates: string | null;
  eventIds: string | null;
  scheduleStartDt: string;
  scheduleStopDt: string;
  orgStartDate: string | null;
  orgStopDate: string | null;
  isTodaysAppointment: string | null;
  sundayStartTime1: string;
  sundayStartTime2: string;
  mondayStartTime1: string;
  mondayStartTime2: string;
  tuesdayStartTime1: string;
  tuesdayStartTime2: string;
  saturdayStartTime1: string;
  wednesdayStartTime1: string;
  wednesdayStartTime2: string;
  thursdayStartTime1: string;
  thursdayStartTime2: string;
  fridayStartTime1: string;
  fridayStartTime2: string;
  saturdayStartTime2: string;
  sundayStopTime1: string;
  sundayStopTime2: string;
  mondayStopTime1: string;
  mondayStopTime2: string;
  tuesdayStopTime1: string;
  tuesdayStopTime2: string;
  saturdayStopTime1: string;
  wednesdayStopTime1: string;
  wednesdayStopTime2: string;
  thursdayStopTime1: string;
  thursdayStopTime2: string;
  fridayStopTime1: string;
  fridayStopTime2: string;
  saturdayStopTime2: string;
  bookAppType: string;
  startTime: string | null;
  stopTime: string | null;
  appStartDateTime: string | null;
  appStopDateTime: string | null;
  slotDurationMinutes: string | null;
  noteMessage: string | null;
  noteType: string | null;
  zoomMeetingUrl: string | null;
  petName: string | null;
  meetingUrl: string | null;
  patientEmail: string | null;
  doctorEmail: string | null;
  consultationType: string | null;
  facilityType: string | null;
  callingFrom: string | null;
  slotSequence: number;
  retVal: number;
  slotIndex: number;
  sundayAvailable: number;
  mondayAvailable: number;
  tuesdayAvailable: number;
  wednesdayAvailable: number;
  thursdayAvailable: number;
  fridayAvailable: number;
  saturdayAvailable: number;
  age: number;
  activeInd: number;
  prescriptionCount: number;
  documentCount: number;
  teleConsultationStartByVetInd: number;
  patientUid: number;
  patientMrn: string | null;
  appointmentId: string | null;
  encounterId: string | null;
  doctorUId: string | null;
  slotId: number;
  facilityId: number;
  orgId: number;
  orgUserId: number;
  insertUserId: string | null;
  updateUserId: string | null;
  summaryId: string | null;
  noOfPatients: number;
  appCount: string | null;
  petOwnerUid: string | null;
  uploadedDocumentsList: string | null;
  uploadedPrescriptionsList: string | null;
  loggedInFacilityId: number;
}

export const getEditSlotData = async (payload: GetEditSlotDataPayload): Promise<GetEditSlotDataResponse> => {
  try {
    const { data } = await http.post<GetEditSlotDataResponse>('/geteditslotdata', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const editSlot = async (payload: AddSlotPayload): Promise<AddSlotResponse> => {
  try {
    const { data } = await http.post<AddSlotResponse>('/editslot', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

interface TemporaryAdjustCalendarPayload {
  userName: string;
  userPass: string;
  deviceStat: string;
  startDate: string;
  orgId: string | undefined;
  facilityId: number;
  dayTime: string;
  slotDuration: string;
  slotDuration2: string;
  bookAppType: string;
  slotId: string;
}

interface TemporaryAdjustCalendarResponse {
  message: string;
  status: string;
}

export const temporaryAdjustCalendar = async (payload: TemporaryAdjustCalendarPayload): Promise<TemporaryAdjustCalendarResponse> => {
  try {
    const { data } = await http.post<TemporaryAdjustCalendarResponse>('/temporaryadjustcalendar', payload);
    return data;
  } catch (error) {
    throw error;
  }
};
