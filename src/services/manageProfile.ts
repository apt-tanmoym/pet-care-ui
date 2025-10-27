import http from '@/common/http';

export const getDoctorDetails = async (payload: any): Promise<any[]> => {
  try {
    const { data } = await http.post<any>('/getdoctorprofiledetails', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const saveDoctorEducation = async (payload: any): Promise<any[]> => {
  try {
    const { data } = await http.post<any>('/savedoctoreducation', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const saveDoctorExperience = async (payload: any): Promise<any[]> => {
  try {
    const { data } = await http.post<any>('/savedoctorexperience', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const saveProfileApi = async (payload: any): Promise<any[]> => {
  try {
    const { data } = await http.post('/editaccountdetails', payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};

