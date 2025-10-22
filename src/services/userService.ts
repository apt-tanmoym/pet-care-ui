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
    loggedinFacilityId: '1',
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