import http from '../common/http';

// Interface for API payloads
interface GetOrgUsersPayload {
  userName: string;
  userPwd: string;
  callingFrom: string;
  orgId: string;
  loggedinFacilityId: string;
  orgFacilityId: string;
  statusId: number;
}

interface GetUserDetailsPayload {
  callingFrom: string;
  userName: string;
  userPwd: string;
  orgId: string;
  loggedinFacilityId: string;
  orgUserId: string;
}

interface GetAllRoleGroupOfOrgPayload {
  callingFrom: string;
  userName: string;
  userPass: string;
  orgId: string;
}

// Interface for user response
interface User {
  orgUserId: number;
  userNameWithTitle?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  cellNumber?: string;
  imageFilePath?: string;
  activeInd: number;
  isDoctor: number;
  userTitle?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  areaName?: string;
  country?: string;
  state?: string;
  pin?: string;
  userName?: string;
  userUid?: number;
  specialty?: string;
  orgUserQlfn?: string;
  councilId?: string;
  yearOfReg?: number;
  roleName?: string;
  imageFileName?: string;
}

// Interface for council response
interface Council {
  councilId: string;
  councilName: string;
  statusMessage?: string | null;
  errorMessage?: string | null;
}

// Interface for role group response
interface RoleGroup {
  roleGroupId: number;
  roleGroupName: string;
}

// Fetch all users (getorgusers)
export const getOrgUsers = async (statusId: number): Promise<User[]> => {
  const payload: GetOrgUsersPayload = {
    userName: localStorage.getItem('userName') || '',
    userPwd: localStorage.getItem('userPwd') || '',
    callingFrom: 'web',
    orgId: localStorage.getItem('orgId') || '',
    loggedinFacilityId: '1',
    orgFacilityId: '0',
    statusId,
  };

  try {
    const response = await http.post('/getorgusers', payload);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Fetch user details (getuserdetails)
export const getUserDetails = async (orgUserId: string): Promise<User | null> => {
  const payload: GetUserDetailsPayload = {
    callingFrom: 'web',
    userName: localStorage.getItem('userName') || '',
    userPwd: localStorage.getItem('userPwd') || '',
    orgId: localStorage.getItem('orgId') || '',
    loggedinFacilityId: localStorage.getItem('loggedinFacilityId') || '1',
    orgUserId,
  };

  try {
    const response = await http.post('/getuserdetails', payload);
    return response.data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    return null;
  }
};

// Fetch council list (getcouncillist)
export const getCouncilList = async (): Promise<Council[]> => {
  try {
    const response = await http.post('/getcouncillist', {});
    return response.data;
  } catch (error) {
    console.error('Error fetching council list:', error);
    return [];
  }
};

export const editUser = async (payload: any): Promise<any> => {
  try {
    const { data } = await http.post('/edituserdetails', payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
}

export const addUser = async (payload: any): Promise<any> => {
  try {
    const { data } = await http.post('/adduserdetails', payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
}

export const getSpecalityList = async (): Promise<any[]> => {
  

  try {
    const {data} = await http.post('/getspecialtylist', {});
    return data;
  } catch (error) {
    console.error('Error fetching specality list:', error);
    return [];
  }
};

// Fetch role group list (getallrolegroupoforg)
export const getAllRoleGroupOfOrg = async (orgId: string = localStorage.getItem('orgId') || ''): Promise<RoleGroup[]> => {
  const payload: GetAllRoleGroupOfOrgPayload = {
    callingFrom: 'web',
    userName: localStorage.getItem('userName') || '',
    userPass: localStorage.getItem('userPwd') || '',
    orgId,
  };

  try {
    const response = await http.post('/getallrolegroupoforg', payload);
    return response.data;
  } catch (error) {
    console.error('Error fetching role group list:', error);
    return [];
  }
};

// Interface for registration details payload
interface RegistrationDetailsPayload {
  councilId: string;
  yearReg: string;
  registrationNumber: string;
}

// Interface for registration details response
export interface RegistrationDetailsResponse {
  councilId: string | null;
  registrationNumber: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  statusMessage: string;
  cellNumber: string | null;
  orgUserQlfn: string | null;
  userName: string | null;
  createdBy: string | null;
  gblSpltyId: number | null;
  provUserUid: number | null;
  userUid: number | null;
  yearReg: number;
}

// Check doctor registration details
export const checkDoctorRegistration = async (payload: RegistrationDetailsPayload): Promise<RegistrationDetailsResponse> => {
  try {
    const response = await http.post('/registrationdetails', payload);
    return response.data;
  } catch (error) {
    console.error('Error checking doctor registration:', error);
    throw error;
  }
};

// Get doctor list interfaces
export interface GetDoctorListPayload {
  callingFrom: string;
  userName: string;
  userPass: string;
  deviceStat: string;
  orgId: string;
}

export interface DoctorListItem {
  userName: string;
  roleName: string | null;
  imageFilePath: string | null;
  roleGroup: string | null;
  userNameWithTitle: string | null;
  email: string | null;
  userLoggedInAs: string | null;
  clinicType: string | null;
  userPassword: string | null;
  userTitle: string | null;
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  cellNumber: string | null;
  imageFileName: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  pin: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  orgUserQlfn: string | null;
  specialty: string;
  areaName: string | null;
  profileDetails: string | null;
  councilId: string | null;
  ownerUid: number;
  orgUserId: number;
  orgId: number;
  userUid: number;
  aptcarePUserId: number;
  glbSpltyId: number;
  cityPincodeMappingId: number;
  cityId: number;
  activeInd: number;
  isDoctor: number;
  yearOfReg: number;
  charge: number;
  registrationNumber: string | null;
}

// Get doctor list API
export const getDoctorList = async (payload: GetDoctorListPayload): Promise<DoctorListItem[]> => {
  try {
    const response = await http.post('/getdoctorlist', payload);
    return response.data;
  } catch (error) {
    console.error('Error fetching doctor list:', error);
    throw error;
  }
};