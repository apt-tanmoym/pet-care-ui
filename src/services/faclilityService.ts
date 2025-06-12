import http from '@/common/http';
import { FaclityServicePayload, FaclityServiceResponse } from '@/interfaces/facilityInterface';



export const getOwnFacilites = async (payload: FaclityServicePayload): Promise<FaclityServiceResponse[]> => {
  try {
    const { data } = await http.post<FaclityServiceResponse[]>('/getownfacility', payload);
      
    return data;
  } catch (error) {
    throw error;
  }
};
